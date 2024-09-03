/**
 * Converts array to comma-separated string, separated
 * by and for two or ending the last item with and
 * and an Oxford comma.
 *
 * @param {Array} array Array of strings.
 * @return {string} Comma separated string.
 */
const commaSeparate = ( array ) =>
	array.length <= 2
		? array.join( ' and ' )
		: `${ array.slice( 0, -1 ).join( ', ' ) }, and ${
				array[ array.length - 1 ]
		  }`;

export default commaSeparate;
