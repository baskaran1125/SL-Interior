import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  uploading?: boolean;
  previewUrls?: string[];
  onRemovePreview?: (index: number) => void;
}

const ImageUploader = ({
  onUpload,
  multiple = false,
  maxFiles = 10,
  uploading = false,
  previewUrls = [],
  onRemovePreview,
}: ImageUploaderProps) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
      onUpload(acceptedFiles);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple,
    maxFiles,
    disabled: uploading,
  });

  const removeLocalPreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const allPreviews = [...previewUrls, ...previews];

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-amber-400 bg-amber-500/10'
            : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-900'
        } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
          ) : (
            <Upload className="w-10 h-10 text-zinc-500" strokeWidth={1.5} />
          )}
          <div>
            <p className="text-sm text-zinc-300">
              {isDragActive ? 'Drop images here...' : 'Drag & drop images here, or click to browse'}
            </p>
            <p className="text-xs text-zinc-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
          </div>
        </div>
      </div>

      {/* Previews */}
      {allPreviews.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {allPreviews.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (i < previewUrls.length) {
                    onRemovePreview?.(i);
                  } else {
                    removeLocalPreview(i - previewUrls.length);
                  }
                }}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
