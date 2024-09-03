/**
 * WordPress dependencies.
 */
import { useEntityProp } from '@wordpress/core-data';
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Styles.
 */
import './edit.scss';

/**
 * SEO Prevent index toggle control component.
 */
function SeoPreventIndex() {
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

	// Destructure meta for exclusion toggle.
	// NOTE: Post meta needs string format as boolean in the form of on/off string.
	// Grab both old and new meta value for backwards compatibility.
	const {
		mt_exclude_from_seo: preventIndexOld = 'off',
		_mt_exclude_from_seo: preventIndexNew = '',
	} = meta || {};
	// First check for new meta value. If it is not set, grab the old meta value which can be 'off' by default.
	const preventIndex =
		'' !== preventIndexNew ? preventIndexNew : preventIndexOld;

	return (
		<ToggleControl
			checked={ 'on' === preventIndex }
			className="seo-prevent-index"
			help={ __(
				'When enabled, this post/page will not be seen by search engines. It will be removed from the website sitemap, and a noindex,follow meta tag will be output to the website header while viewing the post/page.',
				'gutenberg-block-showcase'
			) }
			label={ __(
				'Prevent search engines from indexing this post/page',
				'gutenberg-block-showcase'
			) }
			onChange={ () =>
				setMeta( {
					...meta,
					_mt_exclude_from_seo:
						'on' === preventIndex ? 'off' : 'on',
				} )
			}
		/>
	);
}

export default SeoPreventIndex;
