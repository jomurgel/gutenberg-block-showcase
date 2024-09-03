/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Components.
 */
import Edit from './edit';
import metadata from './block.json';

/**
 * Register the Bottom Block block.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-registration/
 */
registerBlockType( metadata, {
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
	 */
	edit: Edit,

	/**
	 * The save method needs to return the InnerBlocks.Content in this instance with dynamic rendering .
	 *
	 * @see https://github.com/WordPress/gutenberg/blob/e4baab9e4b1bb2d2d16046bed0f7cec97aae7d05/packages/block-editor/src/components/inner-blocks/README.md
	 */
	save: () => <InnerBlocks.Content />,
} );

// export for testing
export { metadata, Edit };
