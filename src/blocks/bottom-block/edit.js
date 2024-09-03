/**
 * WordPress dependencies.
 */
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Styles.
 */
import './edit.scss';

/**
 * The edit function for topBlock.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 */
function Edit() {
	/**
	 * Current parent block props.
	 */
	const blockProps = useBlockProps();

	/**
	 * Dispatchers.
	 */
	const { clearSelectedBlock } = useDispatch( 'core/block-editor' );

	/**
	 * Pass class/attributes defined by Gutenberg core.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useinnerblocksprops
	 */
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		// Setup the bottom block with all of our parent attributes by default.
		// The title and type would be the only defaults, but this ensures a continual sync.
		template: [
      [
        "gbs/post-term-selector",
        {
          "term": "post_tag"
        }
      ],
      [
        "gbs/post-term-selector",
        {
          "term": "category"
        }
      ],
      [ "gbs/seo" ],
    ],
		orientation: 'vertical',
		renderAppender: false,
		templateLock: 'all',
	} );

	/**
	 * Auto-clear any auto-selected blocks.
	 */
	useEffect( () => {
		clearSelectedBlock();
		// Onload.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	return <div { ...innerBlocksProps } />;
}

export default Edit;
