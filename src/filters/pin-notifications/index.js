/**
 * WordPress dependencies.
 */
import { registerPlugin } from '@wordpress/plugins';
import { useState, useEffect } from '@wordpress/element';

const FIXED_STYLES = {
	position: 'sticky',
	transition: 'all 0.3s ease-in-out',
	width: '100%',
	zIndex: 31,
};

/**
 * Reset editor panel on page refresh or initial load.
 */
function FixNotifications() {
	/**
	 * Local State.
	 */
	const [noticeListDismissible, setNoticeListDismissible] =
		useState(null);
	const [noticeListPinned, setNoticeListPinned] = useState(null);
	const [scrollOffset, setScrollOffset] = useState(0);
	const [scrollPosition, setScrollPosition] = useState(0);
	const [toolBarOffset, setToolBarOffset] = useState(0);

	/**
	 * Save scroll position on scroll.
	 */
	useEffect(() => {
		const contentContainer = document.querySelector(
			'.interface-interface-skeleton__content'
		);

		/**
		 * Helper to set the scroll position.
		 */
		const handleScroll = () =>
			setScrollPosition(contentContainer.scrollTop);

		// Add listener for offset on scroll assuming we have our content container.
		if (contentContainer) {
			contentContainer.addEventListener('scroll', handleScroll, {
				passive: true,
			});
		}

		// Cleanup, regardless.
		return () => {
			contentContainer.removeEventListener('scroll', handleScroll);
		};
	}, []);

	/**
	 * Handle creating the toolBar offset (if it exists).
	 */
	useEffect(() => {
		// Get the post layout (contains all elements).
		const editPostLayout = document.querySelector('.edit-post-layout');

		// Check to see if we have a toolbar active or if we're in per-block editing modes.
		// And make sure we're not in text-edit mode (only needed for visual mode).
		const hasToolbarModeActive =
			editPostLayout.classList.contains('has-fixed-toolbar') &&
			!editPostLayout.classList.contains('is-mode-text');

		// If we have toolbarModeActive, get height and update offset.
		if (hasToolbarModeActive) {
			const toolBar = document.querySelector(
				'.block-editor-block-contextual-toolbar'
			);

			if (toolBar) {
				setToolBarOffset(toolBar.clientHeight || 0);
			}
		} else {
			// Always reset, handle back and forth with editor modes.
			setToolBarOffset(0);
		}
	}, [scrollPosition]);

	/**
	 * Handle sticking the notice containers.
	 */
	useEffect(() => {
		// Get the two containers that house notices (fixed or otherwise).
		// We should have these always, but always be save and checks below.
		// Set default to null if no selector is available.
		setNoticeListPinned(
			document.querySelector('.components-editor-notices__pinned') ||
			null
		);
		setNoticeListDismissible(
			document.querySelector(
				'.components-editor-notices__dismissible'
			) || null
		);
	}, [scrollPosition]);

	/**
	 * Handle setting the scrollOffset.
	 */
	useEffect(() => {
		// These should exist always, but we need to wait until state has value.
		if (!noticeListPinned && !noticeListDismissible) {
			return;
		}

		// Create a scroll offset by getting the combined pinned and dismissible
		// Container heights or default 0.
		setScrollOffset(
			(noticeListPinned.clientHeight || 0) +
			(noticeListDismissible.clientHeight || 0)
		);
	}, [noticeListDismissible, noticeListPinned]);

	/**
	 * Handle sticking the pinned notice containers.
	 */
	useEffect(() => {
		// These should exist always, but we need to wait until state has value.
		if (!noticeListPinned && !noticeListDismissible) {
			return;
		}

		// If we hav the noticeListPinned container, append styles accordingly.
		if (scrollPosition > scrollOffset && noticeListPinned) {
			Object.assign(noticeListPinned.style, {
				...FIXED_STYLES,
				top: `${toolBarOffset}px`,
			});
		} else {
			// Or remove styles.
			noticeListPinned.style.cssText = '';
		}
	}, [
		noticeListDismissible,
		noticeListPinned,
		scrollOffset,
		scrollPosition,
		toolBarOffset,
	]);

	/**
	 * Handle sticking the dismissible notice containers.
	 */
	useEffect(() => {
		// These should exist always, but we need to wait until state has value.
		if (!noticeListPinned && !noticeListDismissible) {
			return;
		}

		// If we have the noticeListDismissible container, append styles accordingly.
		if (scrollPosition > scrollOffset && noticeListDismissible) {
			const dismissibleOffset =
				noticeListPinned?.clientHeight + toolBarOffset || 0;
			Object.assign(noticeListDismissible.style, {
				...FIXED_STYLES,
				top: `${dismissibleOffset}px`,
			});
		} else {
			// Or remove styles.
			noticeListDismissible.style.cssText = '';
		}
	}, [
		noticeListDismissible,
		noticeListPinned,
		scrollOffset,
		scrollPosition,
		toolBarOffset,
	]);

	// Bail.
	// We're using this component as a watcher and not to render a JSXElement.
	return null;
}

registerPlugin('fix-notifications', { render: FixNotifications });
