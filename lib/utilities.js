import { supabase } from './supabase';

// Config
const BUCKET_NAME = 'hennastore';
const IMAGE_FOLDER = 'photos';
const VIDEO_FOLDER = 'videos';
const ITEMS_PER_PAGE = 20;

/**
 * Fetch media files (images + videos) from Supabase
 * @param {number} pageNumber - Pagination
 * @param {string} type - 'image' or 'video'
 * @returns {Array} Media objects with src, alt, and type
 */
export const fetchMediaApi = async (pageNumber = 1, type = 'image') => {
  const folder = type === 'video' ? VIDEO_FOLDER : IMAGE_FOLDER;
  
  try {
    const { data: files, error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: ITEMS_PER_PAGE,
        offset: (pageNumber - 1) * ITEMS_PER_PAGE,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) throw error;

    return files.map(file => ({
      src: supabase
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(`${folder}/${file.name}`).data.publicUrl,
      alt: file.name.replace(/\.[^/.]+$/, ""),
      type: type // 'image' or 'video'
    }));

  } catch (error) {
    console.error(`Supabase ${type} fetch error:`, error);
    return [];
  }
};

/**
 * Search media files
 * @param {string} query - Search term
 * @param {string} type - 'image' or 'video' (optional)
 * @returns {Array} Filtered media
 */
export const fetchMediaApi_search = async (query, type) => {
  const allMedia = await fetchMediaApi(1, type);
  return allMedia.filter(item => 
    item.alt.toLowerCase().includes(query.toLowerCase())
  );
};

/**
 * Download handler for both images and videos
 */
export const downloadHandler = async ({ src, alt, type }) => {
  try {
    // For private files, use createSignedUrl() first
    const response = await fetch(src);
    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const ext = type === 'video' ? 'mp4' : 'jpeg';

    const link = document.createElement("a");
    link.href = url;
    link.download = `${alt.replace(/\W/g, '_')}_${type}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error(`${type} download error:`, error);
  }
};

// Legacy functions (keep for compatibility)
export const fetchImageApi = (page) => fetchMediaApi(page, 'image');
export const fetchImageApi_search = (query) => fetchMediaApi_search(query, 'image');
