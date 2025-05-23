import { supabase } from './supabase';

export const fetchMediaFromSupabase = async (bucket = 'hennastore') => {
  const folders = ['images', 'videos'];

  const mediaItems = [];

  for (const folder of folders) {
    const { data: files, error } = await supabase
      .storage
      .from(bucket)
      .list(folder, { limit: 100 });

    if (error) {
      console.error(`Error fetching from ${folder}:`, error);
      continue;
    }

    const items = await Promise.all(
      files.map(async (file) => {
        const fullPath = `${folder}/${file.name}`;

        const { data: signedUrlData } = await supabase
          .storage
          .from(bucket)
          .createSignedUrl(fullPath, 3600); // 1 hour

        if (!signedUrlData?.signedUrl) return null;

        const extension = file.name.split('.').pop()?.toLowerCase();
        const isVideo = ['mp4', 'webm', 'mov'].includes(extension);

        return {
          name: file.name,
          folder,
          url: signedUrlData.signedUrl,
          type: isVideo ? 'video' : 'image',
        };
      })
    );

    mediaItems.push(...items.filter(Boolean));
  }

  return mediaItems;
};
