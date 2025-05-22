// components/UploadButton.tsx
'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const UploadButton = ({ onUploadSuccess }: { onUploadSuccess?: () => void }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select a file to upload.');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hennastore')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      toast.success('File uploaded successfully!');
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      toast.error('Error uploading file!');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer">
        {uploading ? 'Uploading...' : 'Upload Media'}
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleUpload}
          accept="image/*,video/*"
          disabled={uploading}
        />
      </label>
    </div>
  );
};
