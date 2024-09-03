/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';
import { tag } from '@wordpress/icons';

/**
 * Components.
 */
import Edit from './edit.js';
import variations from './variations.js';
import metadata from './block.json';

/**
 * Register the GBS Post Terms block.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-registration/
 */
registerBlockType( metadata, {
	/**
	 * Can either be a dashicon from https://developer.wordpress.org/resource/dashicons/
	 * or an svg element.
	 *
	 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#icon-optional
	 */
	icon: tag,

	/**
	 * Block Variations is the API that allows a block to have similar versions of it,
	 * but all these versions share some common functionality.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/
	 */
	variations,

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
	save: () => null,
} );

// export for testing
const postTermSelectorMetadata = { ...metadata, icon: tag, variations };
export { postTermSelectorMetadata, Edit };
