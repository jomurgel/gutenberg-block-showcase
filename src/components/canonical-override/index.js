/**
 * WordPress dependencies.
 */
import { useEntityProp } from '@wordpress/core-data';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Canonical Override field component.
 */
function CanonicalOverride() {
	/**
	 * Get the post type to pass to the entity provider.
	 *
	 * @see https://github.com/WordPress/gutenberg/blob/8d46fcdfdb929739b10ffe715073d15db5123ff9/packages/core-data/src/entity-provider.js#L91
	 */
	const postType = useSelect(
		( select ) => select( 'core/editor' ).getCurrentPostType(),
		[]
	);
	/**
	 * Fetch value and setter for meta from the store.
	 *
	 * @see https://github.com/WordPress/gutenberg/blob/8d46fcdfdb929739b10ffe715073d15db5123ff9/packages/core-data/src/entity-provider.js#L102
	 */
	const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );

	// Destructure meta for canonical url.
	const { _canonical_override: canonicalUrl = '' } = meta || {};

	return (
		<TextControl
			help={ __(
				'The Canonical URL, if different from the posts URL',
				'gutenberg-block-showcase'
			) }
			label={ __( 'Canonical Override', 'gutenberg-block-showcase' ) }
			onChange={ ( next ) =>
				setMeta( { ...meta, _canonical_override: next } )
			}
			type="url"
			value={ canonicalUrl }
		/>
	);
}

export default CanonicalOverride;
