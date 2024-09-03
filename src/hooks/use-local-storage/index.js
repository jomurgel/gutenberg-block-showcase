/**
 * WordPress dependencies.
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Get local storage helper.
 *
 * @param {string} key          Local storage key.
 * @param {mixed}  defaultValue Default value for local storage.
 * @return {mixed} New value else default value.
 */
export const getStorageValue = ( key, defaultValue ) => {
	const saved = window.localStorage.getItem( key );
	const initial = JSON.parse( saved );
	return initial || defaultValue;
};

/**
 * Hook to return local storage value by key.
 *
 * @param {string} key          Local storage key.
 * @param {mixed}  defaultValue Default value for local storage.
 *
 * @return {Array} Duple value and setter.
 */
export const useLocalStorage = ( key, defaultValue ) => {
	const [ value, setValue ] = useState( () =>
		getStorageValue( key, defaultValue )
	);

	useEffect( () => {
		// storing input name
		window.localStorage.setItem( key, JSON.stringify( value ) );
	}, [ key, value, setValue ] );

	return [ value, setValue ];
};
