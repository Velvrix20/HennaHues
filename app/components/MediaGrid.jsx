// components/MediaGrid.jsx
import MediaCard from './MediaCard'; // Changed from named to default import
import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { fetchMediaFromSupabase } from '../lib/mediaService';
import { UploadButton } from './UploadButton';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

export const MediaGrid = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const items = await fetchMediaFromSupabase();
      setMediaItems(items);
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  return (
    <div className="px-4">
      <div className="flex justify-end mb-4">
        <UploadButton onUploadSuccess={loadMedia} />
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {mediaItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </Masonry>
      )}
    </div>
  );
};
