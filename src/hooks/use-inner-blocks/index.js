/**
 * WordPress dependencies.
 */
import { useSelect } from '@wordpress/data';

/**
 * UseInnerBlocks hook..
 *
 * @param {string} clientId Clinet id unique for a block.
 */
const useInnerBlocks = ( clientId ) =>
	useSelect( ( select ) =>
		select( 'core/block-editor' ).getBlocks( clientId )
	) || [];

export default useInnerBlocks;
