/**
 * Given a status, return a color string.
 *
 * @param {string} status Status string.
 * @return {string} Status color.
 */
const getStatusColor = ( status ) => {
	switch ( status?.toLowerCase() ) {
		case 'pending':
			return 'blue';
		case 'future':
			return 'yellow';
		case 'publish':
			return 'green';
		case 'private':
			return 'red';
		default:
			return 'gray';
	}
};

export default getStatusColor;
