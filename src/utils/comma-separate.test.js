import commaSeparate from './comma-separate';

test( 'commaSeparate should properly convert an array to a comma separated string', () => {
	expect( commaSeparate( [] ) ).toEqual( '' );
	expect( commaSeparate( [ 'string1' ] ) ).toEqual( 'string1' );
	expect( commaSeparate( [ 'string1', 'string2' ] ) ).toEqual(
		'string1 and string2'
	);
	expect( commaSeparate( [ 'string1', 'string2', 'string3' ] ) ).toEqual(
		'string1, string2, and string3'
	);
} );
