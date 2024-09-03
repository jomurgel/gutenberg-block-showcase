import getStatusColor from './get-status-color';

test( 'getStatusColor should return a color string', () => {
	expect( getStatusColor( 'pending' ) ).toBe( 'blue' );
	expect( getStatusColor( 'future' ) ).toBe( 'yellow' );
	expect( getStatusColor( 'private' ) ).toBe( 'red' );
	expect( getStatusColor( 'publish' ) ).toBe( 'green' );
	expect( getStatusColor( 'draft' ) ).toBe( 'gray' );
	expect( getStatusColor( '' ) ).toBe( 'gray' );
} );
