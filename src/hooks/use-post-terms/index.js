/**
 * WordPress dependencies.
 */
import { useEntityProp, store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Return terms for a post.
 *
 * @param {int|string} postId   Post id.
 * @param {string}     postType Post type.
 * @param {string}     term     Term type slug.
 *
 * @return {Object} Term objects, loading state, and hasPostTerms bool.
 */
export default function usePostTerms( postId, postType, term ) {
	const { rest_base: restBase = '', slug } = term;
	const [ termIds ] = useEntityProp( 'postType', postType, restBase, postId );
	const { postTerms, hasPostTerms, isLoading } = useSelect(
		( select ) => {
			const visible = term?.visibility?.publicly_queryable;
			if ( ! visible ) {
				return {
					postTerms: [],
					isLoading: false,
					hasPostTerms: false,
				};
			}
			if ( ! termIds ) {
				// Waiting for post terms to be fetched.
				return {
					postTerms: [],
					hasPostTerms: false,
					isLoading: term?.postTerms?.includes( postType ),
				};
			}
			if ( ! termIds?.length ) {
				return { postTerms: [], hasPostTerms: false, isLoading: false };
			}
			const { getEntityRecords, isResolving } = select( coreStore );
			const taxonomyArgs = [
				'taxonomy',
				slug,
				{
					include: termIds,
					context: 'view',
					_fields: 'id,name,slug,parent',
				},
			];
			const terms = getEntityRecords( ...taxonomyArgs );
			return {
				postTerms: terms,
				hasPostTerms: terms?.length,
				isLoading: isResolving( 'getEntityRecords', taxonomyArgs ),
			};
		},
		// TODO: This hook may be prime for a good refactor and simplification.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ termIds, term?.visibility?.publicly_queryable ]
	);

	return ! term
		? [ [], false, false ]
		: [ postTerms, hasPostTerms, isLoading ];
}
