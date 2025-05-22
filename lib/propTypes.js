// lib/propTypes.js
import PropTypes from 'prop-types';

export const mediaItemPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['image', 'video']).isRequired,
  url: PropTypes.string.isRequired,
  title: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  created_at: PropTypes.string,
});
