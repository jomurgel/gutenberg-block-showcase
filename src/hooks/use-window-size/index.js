/**
 * WordPress Dependencies.
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Returns array of height and width in [ height, width ] format.
 *
 * @return {Array} Returns a tuple of the current window height and width.
 */
const useWindowSize = () => {
	const [ size, setSize ] = useState( [ 0, 0 ] );

	useEffect( () => {
		/**
		 * Set the window height and width on resize.
		 */
		const handleResize = () => {
			setSize( [ window.innerHeight, window.innerWidth ] );
		};

		// Add event listeners for load and resize.
		window.addEventListener( 'load', handleResize );
		window.addEventListener( 'resize', handleResize );

		// Call function on mount.
		handleResize();

		// Cleanup.
		return () => {
			window.removeEventListener( 'load', handleResize );
			window.removeEventListener( 'resize', handleResize );
		};
	}, [] );

	return size;
};

export default useWindowSize;
