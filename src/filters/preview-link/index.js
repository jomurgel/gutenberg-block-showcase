/**
 * WordPress dependencies.
 */
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';
/**
 * External dependencies.
 */
import { useEffect } from 'react';
import { createRoot, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Custom components.
 */
import PostPreviewButton from '../../components/post-preview-button';

/**
 * Custom hooks.
 */
import useWindowSize from '../../hooks/use-window-size';

/**
 * Mount replacement button for preview link.
 */
function PreviewLink() {
  /**
   * Local state.
   */
  const [preview, setPreview] = useState(null);
  const [hasPreviewButton, setHasPreviewButton] = useState(false);

  /**
   * Watch window width.
   */
  const [, width] = useWindowSize();

  /**
   * Filter experimental feature, has device preview.
   *
   * @param {Array} hasDevicePreview Whether not to enable. Default false.
   */
  const hasDevicePreview = applyFilters(
    'editor.previewLink.hasDevicePreview',
    true
  );

  /**
   * Watch preview button for availability.
   */
  useEffect(() => {
    const previewButton = document.querySelector(
      '.editor-preview-dropdown'
    );
    setPreview(previewButton);
    if (previewButton === null) {
      setHasPreviewButton(false);
    }
  }, [width]);

  /**
   * Add the custom preview button.
   */
  useEffect(() => {
    const customPreview = document.querySelector(
      '.block-editor-post-preview__dropdown--new'
    );
    if (null === preview && customPreview) {
      customPreview.remove();
    }

    // Assume already mounted.
    if (hasPreviewButton || !preview) {
      return;
    }

    const previewLink = document.querySelector(
      'a[aria-label="View Post"]'
    );


    if (previewLink) {
      previewLink.remove();
    }

    // Create a new div rather than outright replacing it.
    const newPreview = document.createElement('div');
    newPreview.classList.add('block-editor-post-preview__dropdown--new');
    newPreview.classList.add('custom-preview');

    const parent = preview.parentNode;

    // Make sure we have a parent before attempting to insert.
    // Avoids critical error.
    if (parent) {
      parent.insertBefore(newPreview, preview.nextSibling);
    }

    const button = document.querySelector(
      '.block-editor-post-preview__dropdown--new'
    );

    // If we don't have a preview button, bail.
    if (!button) {
      return;
    }

    preview.style.display = 'none';

    setHasPreviewButton(true);

    const root = createRoot(button);

    // Replace the default preview button.
    // TODO: In React 18 we'll need to update to createRoot.
    root.render(
      <PostPreviewButton
        className="is-tertiary"
        hasDevicePreview={hasDevicePreview}
        textContent={__('Preview', 'gutenberg-block-showcase')}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  return null;
}

registerPlugin('preview-link', { render: PreviewLink });
