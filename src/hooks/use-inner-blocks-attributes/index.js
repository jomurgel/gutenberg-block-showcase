/**
 * Components.
 */
import useInnerBlocks from '../use-inner-blocks';

/**
 * Get the innerBlocks attributes object for innerBlock children.
 *
 * @param {string} clientId Block client id.
 */
const useInnerBlocksAttributes = ( clientId ) =>
	useInnerBlocks( clientId ).map( ( block ) => block.attributes );

export default useInnerBlocksAttributes;
