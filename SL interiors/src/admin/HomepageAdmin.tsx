import { useState, useEffect } from 'react';
import { Loader2, Save, RefreshCw } from 'lucide-react';
import { getAllHomepageContent, updateHomepageSection } from '@/services/homepageService';
import type { HomepageContent } from '@/lib/types';
import { toast } from 'sonner';

const sectionLabels: Record<string, string> = {
  hero: 'Hero Section',
  intro: 'Introduction Section',
  cta: 'Call to Action',
  stats: 'Statistics',
  about_story: 'About Story',
  vision_mission: 'Vision & Mission',
  team: 'Team Members',
};

const HomepageAdmin = () => {
  const [sections, setSections] = useState<HomepageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const data = await getAllHomepageContent();
      setSections(data);
      const fd: Record<string, any> = {};
      data.forEach((s) => { fd[s.section_key] = s.content; });
      setFormData(fd);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleSave = async (key: string) => {
    setSaving(true);
    try {
      await updateHomepageSection(key, formData[key]);
      toast.success(`${sectionLabels[key] || key} updated`);
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const updateField = (section: string, field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const ic = 'w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all';

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-amber-400 animate-spin" /></div>;

  const tabs = Object.keys(sectionLabels);

  const renderHero = () => {
    const d = formData.hero || {};
    return (
      <div className="space-y-4">
        <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Title</label><input value={d.title || ''} onChange={(e) => updateField('hero', 'title', e.target.value)} className={ic} /></div>
        <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Subtitle</label><textarea value={d.subtitle || ''} onChange={(e) => updateField('hero', 'subtitle', e.target.value)} rows={3} className={`${ic} resize-none`} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">CTA Text</label><input value={d.cta_text || ''} onChange={(e) => updateField('hero', 'cta_text', e.target.value)} className={ic} /></div>
          <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">CTA Link</label><input value={d.cta_link || ''} onChange={(e) => updateField('hero', 'cta_link', e.target.value)} className={ic} /></div>
        </div>
      </div>
    );
  };

  const renderIntro = () => {
    const d = formData.intro || {};
    return (
      <div className="space-y-4">
        <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Heading</label><input value={d.heading || ''} onChange={(e) => updateField('intro', 'heading', e.target.value)} className={ic} /></div>
        <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Description</label><textarea value={d.description || ''} onChange={(e) => updateField('intro', 'description', e.target.value)} rows={4} className={`${ic} resize-none`} /></div>
      </div>
    );
  };

  const renderCTA = () => {
    const d = formData.cta || {};
    return (
      <div className="space-y-4">
        <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Heading</label><input value={d.heading || ''} onChange={(e) => updateField('cta', 'heading', e.target.value)} className={ic} /></div>
        <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Description</label><textarea value={d.description || ''} onChange={(e) => updateField('cta', 'description', e.target.value)} rows={3} className={`${ic} resize-none`} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Button Text</label><input value={d.button_text || ''} onChange={(e) => updateField('cta', 'button_text', e.target.value)} className={ic} /></div>
          <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Button Link</label><input value={d.button_link || ''} onChange={(e) => updateField('cta', 'button_link', e.target.value)} className={ic} /></div>
        </div>
      </div>
    );
  };

  const renderStats = () => {
    const d = formData.stats || { items: [] };
    const items = d.items || [];
    const updateItem = (i: number, field: string, value: string) => {
      const newItems = [...items];
      newItems[i] = { ...newItems[i], [field]: value };
      updateField('stats', 'items', newItems);
    };
    const addItem = () => updateField('stats', 'items', [...items, { number: '', label: '' }]);
    const removeItem = (i: number) => updateField('stats', 'items', items.filter((_: any, idx: number) => idx !== i));
    return (
      <div className="space-y-3">
        {items.map((item: any, i: number) => (
          <div key={i} className="flex gap-3 items-center">
            <input value={item.number} onChange={(e) => updateItem(i, 'number', e.target.value)} className={ic} placeholder="e.g., 150+" />
            <input value={item.label} onChange={(e) => updateItem(i, 'label', e.target.value)} className={ic} placeholder="e.g., Projects Completed" />
            <button type="button" onClick={() => removeItem(i)} className="text-zinc-500 hover:text-red-400 text-xs shrink-0">✕</button>
          </div>
        ))}
        <button type="button" onClick={addItem} className="text-xs text-amber-400 hover:text-amber-300">+ Add stat</button>
      </div>
    );
  };

  const renderStory = () => {
    const d = formData.about_story || { heading: '', paragraphs: [''] };
    const updateParagraph = (i: number, v: string) => {
      const p = [...(d.paragraphs || [])]; p[i] = v;
      updateField('about_story', 'paragraphs', p);
    };
    return (
      <div className="space-y-4">
        <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Heading</label><input value={d.heading || ''} onChange={(e) => updateField('about_story', 'heading', e.target.value)} className={ic} /></div>
        {(d.paragraphs || []).map((p: string, i: number) => (
          <div key={i}><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Paragraph {i + 1}</label><textarea value={p} onChange={(e) => updateParagraph(i, e.target.value)} rows={3} className={`${ic} resize-none`} /></div>
        ))}
      </div>
    );
  };

  const renderVision = () => {
    const d = formData.vision_mission || {};
    return (
      <div className="space-y-4">
        <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Vision</label><textarea value={d.vision || ''} onChange={(e) => updateField('vision_mission', 'vision', e.target.value)} rows={3} className={`${ic} resize-none`} /></div>
        <div><label className="text-xs font-medium text-zinc-400 mb-1.5 block">Mission</label><textarea value={d.mission || ''} onChange={(e) => updateField('vision_mission', 'mission', e.target.value)} rows={3} className={`${ic} resize-none`} /></div>
      </div>
    );
  };

  const renderTeam = () => {
    const d = formData.team || { members: [] };
    const members = d.members || [];
    const updateMember = (i: number, field: string, value: string) => {
      const m = [...members]; m[i] = { ...m[i], [field]: value };
      updateField('team', 'members', m);
    };
    const addMember = () => updateField('team', 'members', [...members, { name: '', role: '', bio: '' }]);
    const removeMember = (i: number) => updateField('team', 'members', members.filter((_: any, idx: number) => idx !== i));
    return (
      <div className="space-y-4">
        {members.map((m: any, i: number) => (
          <div key={i} className="p-4 bg-zinc-800/30 rounded-lg space-y-3 relative">
            <button type="button" onClick={() => removeMember(i)} className="absolute top-3 right-3 text-zinc-500 hover:text-red-400 text-xs">✕</button>
            <div className="grid grid-cols-2 gap-3"><input value={m.name} onChange={(e) => updateMember(i, 'name', e.target.value)} className={ic} placeholder="Name" /><input value={m.role} onChange={(e) => updateMember(i, 'role', e.target.value)} className={ic} placeholder="Role" /></div>
            <textarea value={m.bio} onChange={(e) => updateMember(i, 'bio', e.target.value)} rows={2} className={`${ic} resize-none`} placeholder="Bio" />
          </div>
        ))}
        <button type="button" onClick={addMember} className="text-xs text-amber-400 hover:text-amber-300">+ Add member</button>
      </div>
    );
  };

  const renderSection: Record<string, () => JSX.Element> = { hero: renderHero, intro: renderIntro, cta: renderCTA, stats: renderStats, about_story: renderStory, vision_mission: renderVision, team: renderTeam };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-white">Homepage Content</h1><p className="text-zinc-500 text-sm mt-1">Manage website content dynamically</p></div>
        <button onClick={fetchData} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-all"><RefreshCw className="w-4 h-4" /></button>
      </div>

      <div className="flex gap-2 flex-wrap">{tabs.map((t) => (<button key={t} onClick={() => setActiveTab(t)} className={`px-3 py-1.5 text-xs rounded-lg transition-all ${activeTab === t ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>{sectionLabels[t]}</button>))}</div>

      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">{sectionLabels[activeTab]}</h2>
        {renderSection[activeTab]?.()}
        <div className="flex justify-end mt-6 pt-4 border-t border-zinc-800">
          <button onClick={() => handleSave(activeTab)} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomepageAdmin;
