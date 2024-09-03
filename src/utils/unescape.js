/**
 * External dependencies.
 */
import { map, unescape } from 'lodash';

/**
 * Replace apostrophe character with regular one.
 *
 * @param {string} arg String to unescape.
 * @return {string} Unescaped string.
 */
export const unescapeString = ( arg ) => {
	return unescape( arg.replace( '&#039;', "'" ).replaceAll( '&#044;', ',' ) );
};

/**
 * Un-escapes term name.
 *
 * @param {Object} term Term object.
 * @return {Object} Unescaped term name.
 */
export const unescapeTerm = ( term ) => {
	return {
		...term,
		name: unescapeString( term?.name || '' ),
	};
};

/**
 * Un-escape term name for each in array of objects.
 *
 * @param {Array} terms Array of term objects.
 * @return {Array} Array of unescaped term objects.
 */
export const unescapeTerms = ( terms ) => {
	return map( terms, unescapeTerm );
};
