/**
 * External dependencies.
 */
import get from 'lodash/get';;
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { useState, useEffect, useRef } from '@wordpress/element';
import {
  Button,
  DropdownMenu,
  MenuGroup,
  MenuItem,
  VisuallyHidden,
} from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';
import { __, _x } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { mobile, tablet } from '@wordpress/icons';
import { store as coreDataStore } from '@wordpress/core-data';

/**
 * Styles.
 */
import './edit.scss';

/**
 * Global Variables.
 */
const MOBILE_WINDOW = 'width=320,height=640,menubar=no,status=no,titlebar=no';
const TABLET_WINDOW = 'width=768,height=1024,menubar=no,status=no,titlebar=no';

/**
 * Custom component for handling the preview button.
 *
 * @param {Object} param0                  Props.
 * @param {string} param0.className        ClassName string.
 *
 * @param {string} param0.textContent      Button text.
 * @param {string} param0.role             Button type.
 * @param {bool}   param0.hasDevicePreview Whether or not to show device preview.
 * @return {JSXElement} Post preview button (custom).
 */
function PostPreviewButton({
  className,
  hasDevicePreview,
  role,
  textContent,
}) {
  /**
   * Local state.
   */
  const [saved, setSaved] = useState(false);
  const [type, setType] = useState('desktop');

  /**
   * Watch for mobile.
   */
  const isMobile = useViewportMatch('small', '<');

  /**
   * Button ref.
   */
  const buttonRef = useRef(null);

  /**
   * Dispatchers.
   */
  const { autosave, savePost } = useDispatch('core/editor');

  /**
   * Dropdown popover props.
   */
  const popoverProps = {
    className: classNames(
      className,
      'block-editor-post-preview__dropdown-content'
    ),
    position: 'bottom left',
  };

  /**
   * Post content.
   */
  const {
    isAutoSaving,
    isDraft,
    isSaveable,
    isSaving,
    isViewable,
    previewLink,
  } = useSelect((select) => {
    const {
      getCurrentPostAttribute,
      getEditedPostAttribute,
      getEditedPostPreviewLink,
      isAutosavingPost,
      isEditedPostSaveable,
      isSavingPost,
    } = select('core/editor');
    const { getPostType } = select(coreDataStore);

    const postType = getPostType(getEditedPostAttribute('type'));

    return {
      currentPostLink: getCurrentPostAttribute('link'),
      isAutoSaving: isAutosavingPost(),
      isDraft: ['draft', 'auto-draft'].some(
        (status) => status === getEditedPostAttribute('status')
      ),
      isSaveable: isEditedPostSaveable(),
      isSaving: isSavingPost(),
      isViewable: get(postType, ['viewable'], false),
      previewLink: getEditedPostPreviewLink(),
    };
  });

  /**
   * Handle saving the post prior to open.
   *
   * @param {event}  event        Click event.
   * @param {string} viewportType Type of viewport, desktop, tablet, mobile.
   */
  const openPreviewWindow = async (event, viewportType = 'desktop') => {
    // Our Preview button has its 'href' and 'target' set correctly for a11y
    // purposes. Unfortunately, though, we can't rely on the default 'click'
    // handler since sometimes it incorrectly opens a new tab instead of reusing
    // the existing one.
    // https://github.com/WordPress/gutenberg/pull/8330
    event.preventDefault();

    (async () => {
      // Request an autosave. This happens asynchronously and causes the component
      // to update when finished.
      if (isDraft) {
        await savePost({ isPreview: true });
      } else {
        await autosave({ isPreview: true });
      }

      // Set that we've kicked off the save process.
      // Allows the ability to open the new preview.
      setType(viewportType || 'desktop');
      setSaved(true);
    })();
  };

  /**
   * Handle opening the new window target once we've saved or autosave our content.
   */
  useEffect(() => {
    // If we have a good link, we've saved our' data, and we're no longer autosaving or saving, open link.
    if (Boolean(previewLink) && saved && !isAutoSaving && !isSaving) {
      // Display a 'Generating preview' message in the Preview tab while we wait for the
      // autosave to finish.
      switch (type) {
        case 'mobile':
          window.open(
            `${previewLink}&no_admin_bar`,
            '_blank',
            MOBILE_WINDOW,
            true
          );
          break;
        case 'tablet':
          window.open(
            `${previewLink}&no_admin_bar`,
            '_blank',
            TABLET_WINDOW,
            true
          );
          break;
        default:
          window.open(previewLink, '_blank', '', true);
      }
      setSaved(false);
    }
  }, [isAutoSaving, isSaving, saved, previewLink, type]);

  // Bail if we can't preview.
  if (!isViewable) {
    return null;
  }

  return (
    <div
      className={classNames(
        'component__post-preview-button-group',
        {
          'has-device-preview': hasDevicePreview,
        }
      )}
    >
      <Button
        className={classNames(
          {
            'editor-post-preview': !className,
          },
          className
        )}
        disabled={!isSaveable}
        href={previewLink}
        onClick={(event) => openPreviewWindow(event, 'desktop')}
        ref={buttonRef}
        role={role}
        target={'_blank'}
        variant="tertiary"
      >
        {textContent || (
          <>
            {_x('Preview', 'imperative verb')}
            <VisuallyHidden as="span">
              {
                /* translators: accessibility text */
                __('(opens in a new tab)', 'gutenberg-block-showcase')
              }
            </VisuallyHidden>
          </>
        )}
      </Button>

      {!isMobile && hasDevicePreview ? (
        <DropdownMenu
          className="block-editor-post-preview__dropdown"
          icon={mobile}
          label={__('Preview Devices', 'gutenberg-block-showcase')}
          menuProps={{
            'aria-label': __('Preview Devices', 'gutenberg-block-showcase'),
          }}
          noIcons
          popoverProps={popoverProps}
          toggleProps={{
            disabled: !isSaveable,
            className:
              'component__post-preview-dropdown-toggle',
            variant: 'tertiary',
          }}
        >
          {() => (
            <>
              <MenuGroup>
                <MenuItem
                  className="block-editor-post-preview__button-resize"
                  href={`${previewLink}&no_admin_bar`}
                  icon={mobile}
                  onClick={(event) =>
                    openPreviewWindow(event, 'mobile')
                  }
                >
                  {__('Mobile', 'mobile')}
                </MenuItem>
                <MenuItem
                  className="block-editor-post-preview__button-resize"
                  href={`${previewLink}&no_admin_bar`}
                  icon={tablet}
                  onClick={(event) =>
                    openPreviewWindow(event, 'tablet')
                  }
                >
                  {__('Tablet', 'gutenberg-block-showcase')}
                </MenuItem>
              </MenuGroup>
            </>
          )}
        </DropdownMenu>
      ) : null}
    </div>
  );
}

PostPreviewButton.defaultProps = {
  className: '',
  hasDevicePreview: false,
  role: 'menuItem',
  textContent: '',
};

PostPreviewButton.propTypes = {
  className: PropTypes.string,
  hasDevicePreview: PropTypes.bool,
  role: PropTypes.string,
  textContent: PropTypes.string,
};

export default PostPreviewButton;
