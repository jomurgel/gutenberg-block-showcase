/**
 * External dependencies.
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 *
 */
export const POST_SEARCH_SHAPE = {
  id: PropTypes.number,
  media: PropTypes.shape(
    /**
     *
     */
    {
      alt: PropTypes.string,
      url: PropTypes.string,
    }
  ),
  post_type: PropTypes.string,
  status: PropTypes.string,
  subtype: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.exact('post'),
  url: PropTypes.string,
};

/**
 *
 */
export const POST_SEARCH_FORM_DEFAULTS = {
  className: '',
  help: __(
    'Search for any post type by title or post url',
    'gutenberg-block-showcase'
  ),
  label: __('Search for content', 'gutenberg-block-showcase'),
  placeholder: __('Search for content', 'gutenberg-block-showcase'),
  maxPages: 5,
  postTypes: [],
  postsPerPage: 10,
  threshold: 3,
};

/**
 *
 */
export const POST_SEARCH_FORM_SHAPE = {
  className: PropTypes.string,
  help: PropTypes.string,
  label: PropTypes.string,
  maxPages: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  postTypes: PropTypes.arrayOf([PropTypes.string]),
  postsPerPage: PropTypes.number,
  threshold: PropTypes.number,
};
