/**
 * External dependencies.
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Placeholder, Panel, PanelBody } from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';

/**
 * Components.
 */
import CanonicalOverride from '../../components/canonical-override';
import SeoPreventIndex from '../../components/seo-prevent-index/index';
import SeoPreviewEdit from '../../components/seo-preview-edit';

/**
 * The edit function for seo.
 *
 * @param {Object}  props            The root element.
 * @param {boolean} props.isSelected Is the block selected.
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 */
function Edit( { isSelected } ) {
	/**
	 * Local state.
	 */
	const [ blockSelected, setBlockSelected ] = useState( false );

	// Restrict the block to collapse once selected.
	useEffect( () => {
		if ( isSelected && ! blockSelected ) {
			setBlockSelected( true );
		}
	}, [ isSelected, blockSelected ] );

	/**
	 * Pass class/attributes defined by Gutenberg core.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
	 */
	const blockProps = useBlockProps( {
		className: 'component-container',
	} );

	return (
		<div { ...blockProps }>
			<Placeholder isColumnLayout label={ __( 'SEO', 'gutenberg-block-showcase' ) }>
				<SeoPreviewEdit isSelected={ isSelected } />
				<InspectorControls>
					<Panel>
						<PanelBody
							initialOpen={ true }
							title={ __( 'SEO Options', 'gutenberg-block-showcase' ) }
						>
							<SeoPreventIndex />
							<CanonicalOverride />
						</PanelBody>
					</Panel>
				</InspectorControls>
			</Placeholder>
		</div>
	);
}

Edit.propTypes = {
	isSelected: PropTypes.bool.isRequired,
};

export default Edit;
