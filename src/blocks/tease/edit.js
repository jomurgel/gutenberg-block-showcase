/**
 * External dependencies.
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextareaControl } from '@wordpress/components';

/**
 * Custom components.
 */
import CollapsableWrapper from '../../components/collapsable-wrapper';

/**
 * The edit function for tease.
 *
 * @param {Component}                      props                      Root component.
 * @param {Component.className}            props.className            Class name.
 * @param {Component.clientId}             props.clientId             Class client id string.
 * @param {Component.attributes}           props.attributes           Block attributes object.
 * @param {Component.attributes.teaseText} props.attributes.teaseText Teaser texts for this block.
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 */
function Edit( {
	attributes: { teaseText },
	className,
	clientId,
	setAttributes,
} ) {
	/**
	 * Current parent block props.
	 */
	const blockProps = useBlockProps( { className } );

	return (
		<div { ...blockProps }>
			<CollapsableWrapper
				canRemove
				clientId={ clientId }
				isOpen={false}
				title={ __( 'Tease Copy', 'gutenberg-block-showcase' ) }
			>
				<TextareaControl
					hideLabelFromVision
					label={ __( 'Tease Copy Field', 'gutenberg-block-showcase' ) }
					onChange={ ( next ) =>
						setAttributes( { teaseText: next } )
					}
					value={ teaseText }
				/>
			</CollapsableWrapper>
		</div>
	);
}

Edit.propTypes = {
	attributes: PropTypes.shape( { teaseText: PropTypes.string } ).isRequired,
	className: PropTypes.string.isRequired,
	clientId: PropTypes.string.isRequired,
	setAttributes: PropTypes.func.isRequired,
};

export default Edit;
