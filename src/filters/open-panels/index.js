/**
 * WordPress dependencies.
 */
import { registerPlugin } from '@wordpress/plugins';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Open all sidebar panels on load.
 */
function OpenPanels() {
  /**
   * Retrieve the list of current categories.
   */
  const openPanels = useSelect(
    (select) =>
      select('core/preferences').get(
        'core',
        'openPanels'
      ) || {},
    []
  );

  /**
   * Dispatchers.
   */
  const { toggleEditorPanelOpened } = useDispatch('core/editor');

  /**
   * For each panel, if open, close it. Exclude the post-status panel from this behavior.
   */
  useEffect(() => {
    if (openPanels?.length) {
      openPanels.forEach((key) => {
        if (key !== 'post-status') {
          toggleEditorPanelOpened(key);
        }
      });
    } else {
      // Auto-open the post-status panel always.
      toggleEditorPanelOpened('post-status');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

registerPlugin('close-panels', { render: OpenPanels });
