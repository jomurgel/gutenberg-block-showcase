/**
 * WordPress dependencies.
 */
import { useEffect, useMemo, useState } from '@wordpress/element';

/**
 * Determine if a block is visible in the viewport or not.
 *
 * @param {Object} ref Reference object.
 * @return {bool} Whether element is visible or not.
 */
const useOnScreen = ( ref ) => {
	const [ isIntersecting, setIntersecting ] = useState( false );

	const observer = useMemo(
		() =>
			// eslint-disable-next-line no-undef
			new IntersectionObserver( ( [ entry ] ) =>
				setIntersecting( entry.isIntersecting )
			),
		[]
	);

	useEffect( () => {
		if ( ref?.current ) {
			observer.observe( ref?.current );
		}
		return () => observer.disconnect();
	}, [ ref, observer ] );

	return isIntersecting;
};

export default useOnScreen;
