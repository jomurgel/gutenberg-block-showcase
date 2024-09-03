import stripHTMLTags from './strip-html-tags';

test( 'HTML <strong>should</strong> be <b>removed</b> from this <italic>string</italic>', () => {
	expect( stripHTMLTags( [] ) ).toEqual( [] );
	expect( stripHTMLTags( 'This is plain string example' ) ).toEqual(
		'This is plain string example'
	);
	expect(
		stripHTMLTags( 'This <em>string</em> contains <strong>HTML</strong>.' )
	).toEqual( 'This string contains HTML.' );
	expect( stripHTMLTags( '<This is a bad exmaple>' ) ).toEqual( '' );
} );
