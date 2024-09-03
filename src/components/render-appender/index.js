/**
 * External dependencies.
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';

// Hooks.
/**
 * Internal dependencies.
 */
import useInnerBlocksCount from '../../hooks/use-inner-blocks-count';

/**
 * RenderAppender component. Defines custom render appender for InnerBlocks component.
 *
 * @param {Object} props            Props object.
 * @param {Object} props.attributes Attributes object.
 * @param {Object} props.block      Block object defaults.
 * @param {func}   props.callback   Callback after insertion.
 * @param {string} props.clientId   Block id.
 * @param {mixed}  props.icon       String or svg object for icon.
 * @param {string} props.label      Button label.
 * @param {count}  props.max        Max allowed inserted.
 */
function RenderAppender({
	attributes,
	block,
	callback,
	clientId,
	icon,
	label,
	max,
}) {
	/**
	 * Get innerblocks count.
	 */
	const innerBlocksCount = useInnerBlocksCount(clientId);

	/**
	 * Dispatchers.
	 */
	const { insertBlock } = useDispatch('core/block-editor');

	/**
	 * Append custom element on click.
	 */
	const appendBlock = () => {
		insertBlock(
			createBlock(block, attributes),
			innerBlocksCount + 1,
			clientId
		);
		callback(block, attributes);
	};

	return (
		<Button
			disabled={innerBlocksCount >= max}
			icon={icon}
			label={label}
			onClick={appendBlock}
			variant="secondary"
		>
			{label}
		</Button>
	);
}

RenderAppender.defaultProps = {
	attributes: {},
	callback: () => null,
	icon: null,
	label: __('Add Block', 'gutenberg-block-showcase'),
	max: 99,
};

RenderAppender.propTypes = {
	attributes: PropTypes.shape({}),
	block: PropTypes.string.isRequired,
	callback: PropTypes.func,
	clientId: PropTypes.string.isRequired,
	icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	label: PropTypes.string,
	max: PropTypes.number,
};

export default RenderAppender;
