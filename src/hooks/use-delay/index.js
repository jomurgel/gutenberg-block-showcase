/**
 * WordPress dependencies.
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Returns when delay has occurred.
 *
 * @param {int} delay Debounce increment in ms.
 * @return {boolean} True if delay is complete.
 */
const useDelay = ( delay = 2500 ) => {
	const [ isDelayed, setIsDelayed ] = useState( false );

	useEffect( () => {
		setTimeout( () => setIsDelayed( true ), delay );
	}, [ delay ] );

	return isDelayed;
};

export default useDelay;
