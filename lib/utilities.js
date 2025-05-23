import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (add at top of file)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const BUCKET_NAME = 'hennastore'; // Set your bucket name here

export const fetchImageApi = async (pageNumber) => {
  try {
    const { data: files, error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .list('images', { // Change 'photos' to your folder name
        limit: 20,
        offset: (pageNumber - 1) * 20
      });

    if (error) throw error;

    return files.map(file => ({
      src: supabase.storage.from(BUCKET_NAME).getPublicUrl(`photos/${file.name}`).data.publicUrl,
      alt: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for alt text
      photographer: "User" // Maintain expected structure
    }));

  } catch (error) {
    console.error("Supabase error:", error);
    return []; // Return empty array on error to prevent crashes
  }
};

export async function fetchImageApi_search(query) {
  const allImages = await fetchImageApi(1); // Get first page
  return allImages.filter(img => 
    img.alt.toLowerCase().includes(query.toLowerCase())
  );
}

// Keep downloadHandler EXACTLY THE SAME - it already works with Supabase URLs
export const downloadHandler = async ({ imgSrc, imgAlt }) => {
    const imageUrl = imgSrc;
    const imageRes = await fetch(imageUrl);

    if (!imageRes.ok) return;

    const imageBlob = await imageRes.blob();
    const imageOutputUrl = URL.createObjectURL(imageBlob);

    const linkElement = document.createElement("a");
    linkElement.href = imageOutputUrl;
    linkElement.setAttribute("download", `${imgAlt.replace(/\W/g, '_')}_PhotoBooth.jpeg`);
    
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
};
