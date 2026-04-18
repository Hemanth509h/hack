import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../../lib/api';
import ImageCropper from './ImageCropper';

interface ImageUploadProps {
  value: string; // The URL of the currently uploaded image
  onChange: (url: string) => void;
  aspectRatio?: number; // 1 for avatar, 16/9 for banners
  targetFolder?: string; // e.g. "profiles", "events"
  className?: string;
  circle?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  value, 
  onChange, 
  aspectRatio = 1, 
  targetFolder = 'misc',
  className = '',
  circle = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
         setError('File is too large. Max 10MB allowed.');
         return;
      }
      const imageUrl = URL.createObjectURL(file);
      setSelectedFileUrl(imageUrl);
      setError(null);
    }
  };

  const uploadCroppedImage = async (file: File) => {
    setSelectedFileUrl(null); // Close cropper
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('target', targetFolder);

      const res = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onChange(res.data.url);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering upload click
    onChange('');
  };

  return (
    <>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden bg-white dark:bg-gray-900 border-2 border-dashed ${error ? 'border-red-500/50' : 'border-gray-700 hover:border-blue-500/50'} flex flex-col items-center justify-center transition-all ${className} ${circle ? 'rounded-full aspect-square' : 'rounded-2xl'}`}
        style={!circle && aspectRatio !== 1 ? { aspectRatio } : {}}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/png, image/jpeg, image/webp" 
          onChange={onFileSelect}
        />

        {value ? (
          <>
            <img src={value} alt="Upload display" className="w-full h-full object-cover z-0" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col items-center justify-center gap-2">
                <Upload size={24} className="text-gray-900 dark:text-white" />
                <span className="text-gray-900 dark:text-white text-sm font-semibold">Replace Photo</span>
            </div>
            <button 
               onClick={clearImage} 
               className="absolute top-2 right-2 p-1.5 bg-red-500 text-gray-900 dark:text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg z-20 hover:scale-110"
            >
               <X size={14} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-500 group-hover:text-blue-400 transition-colors p-4 text-center">
            {isUploading ? (
               <Loader2 className="animate-spin mb-2" size={32} />
            ) : (
               <ImageIcon size={32} className="mb-2 opacity-50" />
            )}
            <span className="text-sm font-medium">{isUploading ? 'Uploading...' : 'Click to Upload Image'}</span>
          </div>
        )}
      </div>
      
      {error && <p className="text-red-400 text-sm mt-2 font-medium">{error}</p>}

      {selectedFileUrl && (
        <ImageCropper 
           imageSrc={selectedFileUrl} 
           aspectRatio={aspectRatio} 
           onCancel={() => setSelectedFileUrl(null)} 
           onCropComplete={uploadCroppedImage} 
        />
      )}
    </>
  );
};

export default ImageUpload;
