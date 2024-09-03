/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Block dependencies.
 */
import Edit from './edit';
import metadata from './block.json';

/**
 * Register the Top Block block.
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
	 * This function is responsible for rendering the block's content in the editor and on the frontend
	 * when the post or page is viewed.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
	 */
	save: () => <InnerBlocks.Content />,
} );

// export for testing
export { metadata, Edit };
