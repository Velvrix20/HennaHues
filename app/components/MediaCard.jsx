import PropTypes from 'prop-types';
import Image from 'next/image';

const MediaCard = ({ item }) => {
  return (
    <div className="mb-4 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {item.type === 'image' ? (
        <Image
          src={item.url}
          alt={item.title || ''}
          width={500}
          height={300}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      ) : (
        <video
          controls
          className="w-full"
          poster={`/default-thumbnail.jpg`} // Optional fallback
        >
          <source src={item.url} type={`video/${item.url.split('.').pop()}`} />
        </video>
      )}
      {item.title && (
        <div className="p-3 bg-white dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {item.title}
          </h3>
        </div>
      )}
    </div>
  );
};

MediaCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['image', 'video']).isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string,
    created_at: PropTypes.string,
  }).isRequired,
};

export default MediaCard;
