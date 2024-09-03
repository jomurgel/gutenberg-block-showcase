/**
 * WordPress dependencies.
 */
import { registerPlugin } from '@wordpress/plugins';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Hooks.
 */
import useWindowSize from '../../hooks/use-window-size';

/**
 * Reset editor panel on page refresh or initial load.
 */
function ResetEditorPanel() {
	/**
	 * Dispatchers.
	 */
	const { closeGeneralSidebar, openGeneralSidebar } =
		useDispatch('core/edit-post');

	/**
	 * Selectors.
	 */
	const { getActiveGeneralSidebarName } = useSelect('core/edit-post');

	/**
	 * Watch the window width.
	 */
	const [, width] = useWindowSize();

	/**
	 * If the edit-post/document panel is not open, open it.
	 */
	useEffect(() => {
		// Assuming the edit-post/document panel was not open, process dispatch.
		// Avoid a conflict where having the panel open and dispatching will cause Gutenberg to hang.
		if (
			'edit-post/document' !== getActiveGeneralSidebarName() &&
			width > 782
		) {
			openGeneralSidebar('edit-post/document');
		}

		return () => closeGeneralSidebar('edit-post/document');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [width]);

	return null;
}

registerPlugin('reset-editor-panels', { render: ResetEditorPanel });
