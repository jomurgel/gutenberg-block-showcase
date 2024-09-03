/**
 * WordPress dependencies.
 */
import { useSelect } from '@wordpress/data';

/**
 * Get the taxonomy object for the selected term.
 *
 * @param {string}  slug                Term slug.
 * @param {Array}   dependencies        Dependency array.
 * @param {boolean} taxVisibilityIgnore Ignore Taxonomy visibility.
 * @see https://github.com/WordPress/gutenberg/blob/c840e90376da5de3e73af9499571e66fc8f25ff4/packages/core-data/src/index.js#L22
 */
const useTaxonomy = ( slug, dependencies, taxVisibilityIgnore = false ) =>
	useSelect(
		( select ) => {
			const { getTaxonomy } = select( 'core' );
			const taxonomy = getTaxonomy( slug );

			if ( taxVisibilityIgnore ) {
				return taxonomy;
			}
			return taxonomy?.visibility?.publicly_queryable ? taxonomy : {};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ slug, ...dependencies ]
	);

export default useTaxonomy;
