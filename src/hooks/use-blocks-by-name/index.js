/**
 * WordPress dependencies.
 */
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

/**
 * Get all editor blocks by name.
 *
 * @param {string} blockName Block name to search for.
 * @return {Array} Array of block objects.
 */
const useBlocksByName = ( blockName ) => {
	const [ blocksByName, setBlocksByName ] = useState( [] );

	/**
	 * Stringify the return so we can watch the dependency better.
	 * Parse in the useEffect method below.
	 */
	const blocks = useSelect( ( select ) =>
		JSON.stringify( select( 'core/block-editor' ).getBlocks() )
	);

	/**
	 * Return list of blocks by type.
	 */
	useEffect( () => {
		setBlocksByName(
			JSON.parse( blocks ).reduce( ( acc, block ) => {
				if ( block?.name?.includes( blockName ) ) {
					acc.push( block );
				}
				return acc;
			}, [] )
		);
	}, [ blockName, blocks ] );

	return blocksByName;
};

export default useBlocksByName;
