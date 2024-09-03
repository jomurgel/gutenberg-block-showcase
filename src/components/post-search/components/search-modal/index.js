/**
 * External dependencies.
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Styles.
 */
import '../../edit.scss';
import { Modal } from '@wordpress/components';
import { PostSearchForm } from '../..';

/**
 * Proptypes.
 */
import {
	POST_SEARCH_FORM_SHAPE,
	POST_SEARCH_FORM_DEFAULTS,
} from '../../prop-types';

/**
 * Generates the search modal form.
 *
 * @param {Object} props All props.
 * @return {JSXElement} Search modal form component.
 */
function SearchModal(props) {
	// Bail if we shouldn't display this feature.
	if (!props?.isVisible) {
		return null;
	}

	return (
		<Modal
			className="post-search-modal"
			onRequestClose={props?.onRequestClose}
			shouldCloseOnClickOutside={false}
			style={{ maxWidth: 400, width: '100%' }}
			title={props?.title}
		>
			<PostSearchForm {...props} />
		</Modal>
	);
}

SearchModal.defaultProps = {
	...POST_SEARCH_FORM_DEFAULTS,
	title: __('Add Related Content', 'gutenberg-block-showcase'),
};

SearchModal.propTypes = {
	...POST_SEARCH_FORM_SHAPE,
	isVisible: PropTypes.bool.isRequired,
	title: PropTypes.string,
};

export default SearchModal;
