import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Star, Search, Loader2, X, Save } from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject, addProjectImage, deleteProjectImage } from '@/services/projectService';
import { uploadImage, deleteImage } from '@/services/storageService';
import type { Project } from '@/lib/types';
import ImageUploader from './components/ImageUploader';
import ConfirmModal from './components/ConfirmModal';
import EmptyState from './components/EmptyState';
import StatusBadge from './components/StatusBadge';
import { toast } from 'sonner';

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    completion_date: '',
    is_featured: false,
    display_order: 0,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '', category: '', location: '', completion_date: '', is_featured: false, display_order: 0 });
    setPendingFiles([]);
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      category: project.category,
      location: project.location,
      completion_date: project.completion_date || '',
      is_featured: project.is_featured,
      display_order: project.display_order,
    });
    setPendingFiles([]);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }

    setSaving(true);
    try {
      let project: Project;
      if (editing) {
        project = await updateProject(editing.id, form);
        toast.success('Project updated');
      } else {
        project = await createProject(form);
        toast.success('Project created');
      }

      // Upload pending images
      if (pendingFiles.length > 0) {
        setUploadingImages(true);
        for (const file of pendingFiles) {
          const url = await uploadImage('project-images', file, project.id);
          await addProjectImage({
            project_id: project.id,
            image_url: url,
            alt_text: form.title,
            is_primary: false,
            display_order: 0,
          });
        }
        setUploadingImages(false);
      }

      resetForm();
      fetchProjects();
    } catch (err) {
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      // Delete images from storage
      if (deleteTarget.project_images) {
        for (const img of deleteTarget.project_images) {
          await deleteImage('project-images', img.image_url).catch(() => {});
        }
      }
      await deleteProject(deleteTarget.id);
      toast.success('Project deleted');
      setDeleteTarget(null);
      fetchProjects();
    } catch (err) {
      toast.error('Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteImage = async (projectId: string, imageId: string, imageUrl: string) => {
    try {
      await deleteImage('project-images', imageUrl).catch(() => {});
      await deleteProjectImage(imageId);
      toast.success('Image removed');
      fetchProjects();
    } catch (err) {
      toast.error('Failed to delete image');
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  const inputClasses = 'w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className={`${inputClasses} pl-10`}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] overflow-y-auto">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                {editing ? 'Edit Project' : 'New Project'}
              </h2>
              <button onClick={resetForm} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClasses} placeholder="Project title" required />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Category</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClasses} placeholder="e.g., Living Room, Kitchen" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className={`${inputClasses} resize-none`} placeholder="Describe the project..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClasses} placeholder="City, State" />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Completion Date</label>
                  <input type="date" value={form.completion_date} onChange={(e) => setForm({ ...form, completion_date: e.target.value })} className={inputClasses} />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Display Order</label>
                  <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className={inputClasses} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="sr-only peer" />
                  <div className="w-9 h-5 bg-zinc-700 peer-focus:ring-2 peer-focus:ring-amber-500/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600 peer-checked:after:bg-white" />
                </label>
                <span className="text-sm text-zinc-300">Featured project</span>
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-2 block">Project Images</label>
                {editing && editing.project_images && editing.project_images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {editing.project_images.map((img) => (
                      <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700">
                        <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(editing.id, img.id, img.image_url)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <ImageUploader
                  multiple
                  uploading={uploadingImages}
                  onUpload={(files) => setPendingFiles((prev) => [...prev, ...files])}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button type="button" onClick={resetForm} className="px-4 py-2.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No projects found"
          description={search ? 'Try adjusting your search' : 'Add your first project to get started'}
          actionLabel={!search ? 'Add Project' : undefined}
          onAction={!search ? () => { resetForm(); setShowForm(true); } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const primaryImage = project.project_images?.find((i) => i.is_primary) || project.project_images?.[0];
            return (
              <div key={project.id} className="group bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300">
                <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                  {primaryImage ? (
                    <img src={primaryImage.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Star className="w-8 h-8" />
                    </div>
                  )}
                  {project.is_featured && (
                    <div className="absolute top-3 left-3">
                      <StatusBadge status="featured" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(project)} className="p-2 rounded-lg bg-black/70 text-white hover:bg-amber-600 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget(project)} className="p-2 rounded-lg bg-black/70 text-white hover:bg-red-600 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-widest text-amber-400 mb-1">{project.category}</p>
                  <h3 className="text-sm font-semibold text-white">{project.title}</h3>
                  {project.location && (
                    <p className="text-xs text-zinc-500 mt-1">{project.location}</p>
                  )}
                  <p className="text-xs text-zinc-500 mt-1">
                    {project.project_images?.length || 0} images
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default ProjectsAdmin;
