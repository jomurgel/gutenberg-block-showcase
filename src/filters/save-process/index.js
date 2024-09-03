/**
 * External dependencies.
 */
import get from 'lodash/get';;

/**
 * WordPress dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { useSelect } from '@wordpress/data';
import { Button, Modal } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { store as coreDataStore } from '@wordpress/core-data';

/**
 * Components.
 */
import Timer from '../../components/timer';

/**
 * Hooks.
 */
import { getStorageValue } from '../../hooks/use-local-storage';

/**
 * Reset auto-draft if unnecessary (after post hydrate).
 */
function SaveProcess() {
  /**
   * Local state.
   */
  const [isVisible, setVisible] = useState(false);
  const [restSaving, setRestSaving] = useState(false);
  const [metaSaving, setMetaSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [debugSave, setDebugSave] = useState(false);

  /**
   * Get post statuses/info.
   */
  const {
    isSaving,
    isAutoSaving,
    isDraft,
    isSavingMeta,
    postStatus,
    postTypeName,
    isSavingNonEntityChanges,
  } = useSelect((select) => {
    const {
      isSavingPost,
      isAutosavingPost,
      getCurrentPostType,
      getEditedPostAttribute,
      isSavingNonPostEntityChanges,
    } = select('core/editor');
    const { isSavingMetaBoxes } = select('core/edit-post');
    const { getPostType } = select(coreDataStore);

    /**
     * A wrapper for getEntityRecord to get post type registration details and leverages entity types.
     *
     * @see https://github.com/WordPress/gutenberg/blob/b115040cc717b843500a45d8577d413f1732ffa5/packages/core-data/src/index.js#L19
     * @see https://github.com/WordPress/gutenberg/blob/b115040cc717b843500a45d8577d413f1732ffa5/packages/core-data/src/entity-types/type.ts
     */
    const postTypeObject = getPostType(getCurrentPostType());

    /**
     * Get current post status.
     */
    const _postStatus = getEditedPostAttribute('status');

    return {
      isSavingNonEntityChanges: isSavingNonPostEntityChanges(),
      isSaving: isSavingPost(),
      isAutoSaving: isAutosavingPost(),
      isSavingMeta: isSavingMetaBoxes(),
      postStatus: _postStatus,
      isDraft:
        _postStatus === 'draft' ||
        _postStatus === 'auto-draft' ||
        _postStatus === 'pending',
      postTypeName: get(
        postTypeObject,
        ['labels', 'singular_name'],
        ''
      ),
    };
  });

  /**
   * Change status text based on current post status.
   *
   * @return {string} Status text.
   */
  const statusText = () => {
    switch (postStatus) {
      case 'future':
        return __('Scheduling', 'gutenberg-block-showcase');
      case 'draft':
        return __('Saving Draft', 'gutenberg-block-showcase');
      default:
        return restSaving || metaSaving
          ? __('Saving', 'gutenberg-block-showcase')
          : __('Saved', 'gutenberg-block-showcase');
    }
  };

  /**
   * Shared inline button styles.
   */
  const buttonStyles = {
    justifyContent: 'center',
    width: '100%',
  };

  /**
   * Shared inline timer styles.
   */
  const timerStyles = { marginLeft: 5, display: 'inline-block' };

  /**
   * Set modal visibility based on save status.
   */
  useEffect(() => {
    setRestSaving(!isAutoSaving && isSaving);
    setMetaSaving(
      (!isAutoSaving && (isSaving || isSavingMeta)) ||
      isSavingNonEntityChanges
    );

    setDebugSave(getStorageValue('debug_save', false));
  }, [isAutoSaving, isSaving, isSavingMeta, isSavingNonEntityChanges]);

  /**
   * Set modal visibility based on save status.
   */
  useEffect(() => {
    // If we're not published or scheduled, make sure we're a draft to trigger save value.
    // ElseIf we've saved once, set flag. Gets reset on dismiss.
    if (isDraft && metaSaving && Boolean(debugSave)) {
      setHasSaved(true);
    } else if (restSaving && metaSaving && Boolean(debugSave)) {
      setHasSaved(true);
    }

    // Output helpful stats to the console during debug.
    if (Boolean(debugSave)) {
      // eslint-disable-next-line no-console
      console.log({
        restSavingStatus: restSaving,
        metaSavingStatus: metaSaving,
        debugSetting: Boolean(debugSave),
        autoSaveStatus: isAutoSaving,
      });
    }

    // Set general visibility.
    setVisible(restSaving || metaSaving);
  }, [restSaving, metaSaving, debugSave, isDraft, isAutoSaving]);

  /**
   * Hide the modal if it shouldn't be visible.
   */
  if (!isVisible && !hasSaved) {
    return null;
  }

  return (
    <Modal
      isDismissible={debugSave}
      onRequestClose={() => {
        setHasSaved(false);
        setVisible(false);
      }}
      shouldCloseOnClickOutside={false}
      style={{ maxWidth: 250 }}
      title={sprintf(
        /* translators: 1. post status text, 2. post type name */
        __('%1$s %2$s', 'gutenberg-block-showcase'),
        statusText,
        postTypeName
      )}
    >
      <Button
        disabled
        isBusy={restSaving}
        style={{
          ...buttonStyles,
          borderRadius: '3px 3px 0 0',
        }}
        variant="primary"
      >
        {restSaving
          ? __('Saving Block Content', 'gutenberg-block-showcase')
          : __('Saved Block Content', 'gutenberg-block-showcase')}
        {Boolean(debugSave) ? (
          <Timer
            isActive={restSaving}
            style={timerStyles}
            title={__('Saving Timer', 'gutenberg-block-showcase')}
          />
        ) : null}
      </Button>
      <Button
        disabled
        isBusy={metaSaving}
        style={{
          ...buttonStyles,
          borderRadius: '0 0 3px 3px',
        }}
        variant="secondary"
      >
        {metaSaving
          ? __('Saving Post Meta', 'gutenberg-block-showcase')
          : __('Saved Post Meta', 'gutenberg-block-showcase')}
        {Boolean(debugSave) ? (
          <Timer
            isActive={metaSaving}
            style={timerStyles}
            title={__('Saving Meta Timer', 'gutenberg-block-showcase')}
          />
        ) : null}
      </Button>
    </Modal>
  );
}

registerPlugin('save-process', { render: SaveProcess });
