/**
 * External dependencies.
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { Flex, TextControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { copy } from '@wordpress/icons';

/**
 * Component with a bulk term creation feature.
 *
 * @param {Object} props               Props.
 * @param {func}   props.onChange      On change function.
 * @param {Array}  props.selectedTerms Array of selected terms.
 * @return {JSXElement} Bulk term creation.
 */
function BulkTermCreator({ onChange, selectedTerms }) {
	/**
	 * Local state.
	 */
	const [value, setValue] = useState('');

	/**
	 * Get post title.
	 */
	const postTitle = useSelect((select) =>
		select('core/editor').getEditedPostAttribute('title')
	);

	/**
	 * Handler for consolidated existing terms with an auto-generated value.
	 */
	const handleCreateTerms = () =>
		onChange([
			...selectedTerms,
			...value.split(',').map((tag) => tag.trim()),
		]);

	return (
		<Flex align="flex-start">
			<TextControl
				help={__(
					"Add as many terms as you'd like separated by commas.",
					'gutenberg-block-showcase'
				)}
				label={__('Comma-separate Terms', 'gutenberg-block-showcase')}
				onChange={(next) => setValue(next)}
				value={value}
			/>
			<Button
				disabled={!value?.length}
				onClick={handleCreateTerms}
				style={{ marginTop: 16, marginRight: 0, maxHeight: 33 }}
				variant="secondary"
			>
				{__('Create terms', 'gutenberg-block-showcase')}
			</Button>
			<Button
				icon={copy}
				label={__('Copy Post Title', 'gutenberg-block-showcase')}
				onClick={() => setValue(`${value} ${postTitle}`)}
				style={{ margin: '15px 0 0 0' }}
			></Button>
		</Flex>
	);
}

BulkTermCreator.propTypes = {
	onChange: PropTypes.func.isRequired,
	selectedTerms: PropTypes.arrayOf([PropTypes.string]).isRequired,
};

export default BulkTermCreator;
