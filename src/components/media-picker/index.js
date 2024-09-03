/**
 * External dependencies.
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { MediaPlaceholder, MediaUploadCheck } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { Button, Placeholder, Spinner } from '@wordpress/components';

/**
 * Services.
 */
import getMediaUrl from '../../services/get-media-url';

/**
 * MediaPicker component.
 *
 * @param {Object}            props                Props object.
 * @param {Array}             props.allowedTypes   Array of allowed types.
 * @param {string}            props.className      Classname.
 * @param {string|JSXElement} props.icon           Icon string of svg obect.
 * @param {string}            props.imageClassName Image classname.
 * @param {string}            props.instructions   Instructions string.
 * @param {string}            props.label          Label string.
 * @param {func}              props.onReset        Reset callback function.
 * @param {func}              props.onSelect       Select callback function.
 * @param {string}            props.size           Size of the icon.
 * @param {string|int}        props.value          Value to pass to the media picker, id.
 */
function MediaPicker({
  allowedTypes,
  className,
  icon,
  imageClassName,
  instructions,
  label,
  onReset,
  onSelect,
  size,
  value,
}) {
  /**
   * Local state.
   */
  const [src, setSrc] = useState('');

  /**
   * Get the media object given a media ID.
   */
  const media = useSelect(
    (select) => select('core').getMedia(value) || {},
    [value]
  );

  /**
   * Set or reset the image SRC.
   */
  useEffect(() => {
    if (value && media && media.id) {
      const srcUrl = getMediaUrl(media, size);
      // Default to the srcUrl, but if none exists look for the.
      // `source_url` or `url`. Different depending on how the.
      // images are added.
      setSrc(srcUrl || media.source_url || media.url);
    } else {
      setSrc('');
    }
  }, [media, size, value]);

  /**
   * Show spinner if we have an image that we are fetching.
   */
  if (value && !src) {
    return (
      <div className="component__spinner">
        <Spinner />
      </div>
    );
  }

  // Show the MediaPlaceholder if we don't have an image,
  // else show the image and remove button.
  return (
    <div className={`${className} component-media-picker`}>
      {src ? (
        <Placeholder icon={icon} isColumnLayout label={label}>
          <div className={imageClassName}>
            <div>{src}</div>
            <img alt="" src={src} />
          </div>
          <Button
            className="component-media-picker__replace"
            isDestructive
            onClick={onReset}
            size="small"
            style={{ alignSelf: 'flex-start', marginTop: 10 }}
            variant="secondary"
          >
            {__('Replace', 'gutenberg-block-showcase')}
          </Button>
        </Placeholder>
      ) : (
        <MediaUploadCheck>
          <MediaPlaceholder
            allowedTypes={allowedTypes}
            icon={icon}
            labels={{ title: label, instructions }}
            onError={(error) => {
              // eslint-disable-next-line no-console
              console.log(error);
            }}
            onSelect={({ id }) => onSelect(id)}
            value={value}
          />
        </MediaUploadCheck>
      )}
    </div>
  );
}

MediaPicker.defaultProps = {
  allowedTypes: ['image'],
  className: '',
  icon: 'format-image',
  imageClassName: 'component__preview',
  instructions: __(
    'Upload an image or pick one from the media library.',
    'gutenberg-block-showcase'
  ),
  label: __('Image', 'gutenberg-block-showcase'),
  size: 'medium',
};

MediaPicker.propTypes = {
  allowedTypes: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  imageClassName: PropTypes.string,
  instructions: PropTypes.string,
  label: PropTypes.string,
  onReset: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  size: PropTypes.string,
  value: PropTypes.number.isRequired,
};

export default MediaPicker;
