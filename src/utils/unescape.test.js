import { unescapeString, unescapeTerm, unescapeTerms } from './unescape';

test( 'unescapeString should return unescaped string.', () => {
	expect( unescapeString( '' ) ).toEqual( '' );
	expect( unescapeString( '&#039;' ) ).toEqual( "'" );
	expect( unescapeString( 'Test &#039; Text' ) ).toEqual( "Test ' Text" );
} );

test( 'unescapeTerm should return object with unescaped term name..', () => {
	expect( unescapeTerm( { name: '' } ) ).toEqual( { name: '' } );
	expect( unescapeTerm( {} ) ).toEqual( { name: '' } );
	expect( unescapeTerm( { name: '&#039;' } ) ).toEqual( { name: "'" } );
	expect( unescapeTerm( { name: 'Test &#039; Text' } ) ).toEqual( {
		name: "Test ' Text",
	} );
} );

test( 'unescapeTerms should return array of objects with unescaped term name..', () => {
	expect( unescapeTerms( [ { name: '' } ] ) ).toEqual( [ { name: '' } ] );
	expect( unescapeTerms( [ { name: '&#039;' } ] ) ).toEqual( [
		{ name: "'" },
	] );
	expect( unescapeTerms( [ { name: 'Test &#039; Text' } ] ) ).toEqual( [
		{
			name: "Test ' Text",
		},
	] );
} );
