/**
 * Components.
 */
import useInnerBlocks from '../use-inner-blocks';

/**
 * Get the count of innerblocks.
 *
 * @param {string} clientId Block client id.
 */
const useInnerBlocksCount = ( clientId ) => useInnerBlocks( clientId )?.length;

export default useInnerBlocksCount;
