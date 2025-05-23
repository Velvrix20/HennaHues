// lib/mediaService.js
import { supabase } from './supabase';

export const fetchMediaFromSupabase = async (bucketName = 'hennastore') => {
  try {
    // List all files from bucket
    const { data: files, error } = await supabase
      .storage
      .from(bucketName)
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) throw error;

    // Create signed URLs (Valid 1 hour)
    const mediaItems = await Promise.all(
      files.map(async (file) => {
        const { data: urlData } = await supabase
          .storage
          .from(bucketName)
          .createSignedUrl(file.name, 3600); // 1 hour expiry

        const extension = file.name.split('.').pop()?.toLowerCase();
        const isVideo = ['mp4', 'mov', 'avi', 'webm'].includes(extension || '');

        return {
          id: file.name,
          type: isVideo ? 'video' : 'image',
          url: urlData?.signedUrl || '',
          title: file.name.replace(/\.[^/.]+$/, ''),  // Remove file extension
          created_at: file.created_at,
        };
      })
    );

    return mediaItems.filter(item => item.url);  // Filter out items without URLs
  } catch (error) {
    console.error('Error fetching media from Supabase:', error);
    return [];
  }
};
