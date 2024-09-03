/**
 * External dependencies.
 */
import PropTypes from 'prop-types';
import parse from 'html-react-parser';

/**
 * Components.
 */
import SearchCard from '../search-card';

/**
 * WordPress dependencies.
 */
import { Button, Spinner } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Proptypes.
 */
import { POST_SEARCH_SHAPE } from '../../prop-types';

/**
 * Generates the search results.
 *
 * @param {Object}  props             Props.
 * @param {func}    props.onChange    OnChange handler.
 * @param {Array}   props.options     Array of options.
 * @param {boolean} props.isVisible   Whether or not teh search results are visible.
 * @param {string}  props.query       Search query string.
 * @param {boolean} props.isLoading   Whether or not results are loading.
 * @param {func}    props.onLoadMore  Load more function.
 * @param {bool}    props.canLoadMore Whether or not to show the load more button.
 * @param {int}     props.page        Current page number.
 * @return {JSXElement} Search results component.
 */
function SearchResults({
	canLoadMore,
	isLoading,
	isVisible,
	onChange,
	onLoadMore,
	options,
	query,
	page,
}) {
	// If is loading and we don't yet have options, show loader.
	if (isLoading && !options?.length) {
		return <Spinner />;
	}

	// If we shouldn't be visible or have no search query, bail.
	if (!isVisible || !query?.length) {
		return null;
	}

	// If we have a query, aren't loading, but don't have results. Display message.
	if (!options?.length && query?.length) {
		return (
			<div>
				{parse(
					sprintf(
						/* translators: query */ __(
						'No results for <em>"%s"</em>.',
						'gutenberg-block-showcase'
					),
						query
					)
				)}
			</div>
		);
	}

	return (
		<div
			aria-label={sprintf(
				/* translators: search query */
				__('Search results for %s', 'gutenberg-block-showcase'),
				query
			)}
			className="post-search-results"
			role="list"
		>
			{options.map((post) => {
				return (
					<SearchCard
						key={post?.id}
						onChange={onChange}
						value={post}
					/>
				);
			})}
			{canLoadMore ? (
				<Button
					className="post-search-results__load-more"
					isBusy={isLoading || !options?.length}
					onClick={() => onLoadMore(page + 1)}
					variant="primary"
				>
					{__('Load more results', 'gutenberg-block-showcase')}
				</Button>
			) : null}
		</div>
	);
}

SearchResults.propTypes = {
	canLoadMore: PropTypes.bool.isRequired,
	isLoading: PropTypes.bool.isRequired,
	isVisible: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
	onLoadMore: PropTypes.func.isRequired,
	options: PropTypes.arrayOf([PropTypes.shape(POST_SEARCH_SHAPE)])
		.isRequired,
	page: PropTypes.number.isRequired,
	query: PropTypes.string.isRequired,
};

export default SearchResults;
