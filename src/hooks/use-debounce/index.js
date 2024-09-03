/**
 * WordPress dependencies.
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Debounce return of a value.
 *
 * @param {mixed} value Value to debounce.
 * @param {*}     delay Debounce increment in ms.
 * @return {mixed} Debounced value.
 */
const useDebounce = ( value, delay ) => {
	const [ debouncedValue, setDebouncedValue ] = useState( value );

	useEffect( () => {
		const timeoutHandler = setTimeout( () => {
			setDebouncedValue( value );
		}, delay );

		return () => clearTimeout( timeoutHandler );
	}, [ value, delay ] );

	return debouncedValue;
};

export default useDebounce;
