///ib/mediaService.ts
import { supabase } from './supabase';

export interface MediaItem {
  id: string:
  url: string:
  title?: string:
  width: number:
  height: number:
  created_at?: string:
}

//Fetch From your API endpoint
export const fetchMediaFromSupabase = async (bucketName = 'hennastore'): promise<Mediaitem[]> => {
  try {
    //list all files from bucket
    const {data: files, error } = await supabase
    .storage
    .from(bucketName)
    .list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error) throw error;

    //create signed URLs (Valid 1 hours)
    const mediaItems = await Promise.all(
      files.map(async (file) => {
        const { data: urlData } = await supabase
        .storage
        .from(bucketName)
        .createSignedUrl(file.name, 3600); //1hour expiry

       const extension = files.name.split('.').pop()?.toLowerCase();
       const isVideo = ['mp4', 'mov', 'avi', 'webm'].includes(extension || '');

        return {
          id: file.id,
          type: isVideo ? 'video' : 'image',
          url: urlData?.signedUrl || '',
          title: file.name.replace(/\.[^/.]+$/. ''),  //remove file extension
          created_at: file.created_at,
        };
      })
    );

    return mediaItems.filter(item => item.url);  //filter out items without urls
  } catch (error) {
    console.error('Error fetching media from Supabase:', error);
    return [];
  }
};

    

  
