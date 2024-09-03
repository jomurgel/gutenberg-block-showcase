/**
 * Helper to strip HTML tags for a given string.
 *
 * @param {string} data HTML content.
 * @return {string} Stripped HTML content.
 */
const stripHTMLTags = ( data ) => {
	if ( '' === data || typeof data !== 'string' ) {
		return data;
	}
	return data.replace( /(<([^>]+)>)/gi, '' );
};

export default stripHTMLTags;
