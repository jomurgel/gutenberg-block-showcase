/**
 * External dependencies.
 */
import get from 'lodash/get';;
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { __, _x, sprintf } from '@wordpress/i18n';
import { FormTokenField } from '@wordpress/components';

/**
 * Replicate Core Term creation with locking control.
 *
 * @param {Object} props               Props.
 * @param {bool}   props.canCreate     Whether or not term creation is allowed.
 * @param {int}    props.max           Max number of suggestions to display.
 * @param {func}   props.onChange      OnChange handler for selection.
 * @param {func}   props.onInputChange OnChange handler for search results.
 * @param {string} props.singularName  Singular name for label.
 * @param {string} props.slug          Taxonomy slug.
 * @param {Array}  props.suggestions   Array of term suggestions.
 * @param {Object} props.taxonomy      Taxonomy term object.
 * @param {Array}  props.value         Selected value.
 *
 * @return {JSXElement} Flat term selector.
 */
function TermSelector({
	canCreate,
	max,
	onChange,
	onInputChange,
	singularName,
	slug,
	suggestions,
	taxonomy,
	value,
}) {
	return (
		<FormTokenField
			__experimentalShowHowTo={canCreate}
			__experimentalValidateInput={(next) => {
				// Skip validation if we have the ability to add.
				if (canCreate) {
					return true;
				}

				const chosenSelector = document.querySelector(
					'.components-form-token-field__suggestion.is-selected'
				);

				const selectedValue =
					chosenSelector && chosenSelector?.childNodes?.length
						? chosenSelector?.childNodes[0].getAttribute(
							'aria-label'
						)
						: '';

				if (selectedValue === next) {
					return true;
				}

				return false;
			}}
			label={get(
				taxonomy,
				['labels', 'add_new_item'],
				slug === 'post_tag' ? __('Add new tag') : __('Add new Term')
			)}
			maxSuggestions={max}
			messages={{
				added: sprintf(
					/* translators: %s: term name. */
					_x('%s added', 'term'),
					singularName
				),
				removed: sprintf(
					/* translators: %s: term name. */
					_x('%s removed', 'term'),
					singularName
				),
				remove: sprintf(
					/* translators: %s: term name. */
					_x('Remove %s', 'term'),
					singularName
				),
				__experimentalInvalid: sprintf(
					/* translators: %s: term name. */
					_x('Cannot add %s', 'term'),
					singularName
				),
			}}
			onChange={onChange}
			onInputChange={onInputChange}
			suggestions={suggestions}
			value={value}
		/>
	);
}

TermSelector.propTypes = {
	canCreate: PropTypes.bool.isRequired,
	max: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
	onInputChange: PropTypes.func.isRequired,
	singularName: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired,
	suggestions: PropTypes.string.isRequired,
	taxonomy: PropTypes.shape({
		labels: PropTypes.shape({
			add_new_item: PropTypes.string, // eslint-disable-line camelcase
		}),
	}).isRequired,
	value: PropTypes.arrayOf([PropTypes.string]).isRequired,
};

export default TermSelector;
