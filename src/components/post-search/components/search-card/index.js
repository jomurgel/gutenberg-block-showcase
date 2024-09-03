/**
 * External dependencies.
 */
import PropTypes from 'prop-types';
import parse from 'html-react-parser';

/**
 * WordPress dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * PropTypes.
 */
import { POST_SEARCH_SHAPE } from '../../prop-types';

/**
 * Utils.
 */
import getStatusColor from '../../../../services/get-status-color';
import classNames from 'classnames';

/**
 * Generates the search card.
 *
 * @param {Object} props          Props.
 * @param {func}   props.onChange OnChange handler.
 * @param {Object} props.value    Search post object.
 *
 * @return {JSXElement} Search card component.
 */
function SearchCard({ onChange, value }) {
	/**
	 * Destructure value object.
	 */
	const { id, media, title, status, post_type: postType } = value;

	return (
		<Button
			key={id}
			className={classNames(
				'post-search-results__button',
				`post-search-results-status--${getStatusColor(status)}`
			)}
			onClick={() => onChange(value)}
			variant="secondary"
		>
			<span className="post-search-results__image-container">
				{media && media?.url ? (
					<img
						alt={media?.alt}
						className="post-search-results__image"
						src={media?.url}
					/>
				) : (
					<span>{__('No Image Set', 'gutenberg-block-showcase')}</span>
				)}
			</span>
			<span className="post-search-results__info-container">
				<h2 className="post-search-results__title">
					{title
						? parse(decodeEntities(title))
						: __('Untitled', 'gutenberg-block-showcase')}
				</h2>
				<span className="post-search-results__post-type">
					{postType}
				</span>
				{status
					? parse(
						sprintf(
							/* translators: post status */
							__(
								'<i className="post-search-results__status">%s</i>',
								'gutenberg-block-showcase'
							),
							status
						)
					)
					: null}
			</span>
		</Button>
	);
}

SearchCard.propTypes = {
	onChange: PropTypes.func.isRequired,
	value: PropTypes.shape(POST_SEARCH_SHAPE).isRequired,
};

export default SearchCard;
