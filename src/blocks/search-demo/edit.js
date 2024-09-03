/**
 * External dependencies.
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { PostSearchForm, PostSearchModal } from '../../components/post-search';
import { useState } from '@wordpress/element';

/**
 * Styles
 */
import './edit.scss';
import { Button } from '@wordpress/components';

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
	className,
} ) {
  /**
   * Local state.
   */
	const [ modalOpen, setModalOpen ] = useState( false );

	/**
	 * Current parent block props.
	 */
	const blockProps = useBlockProps( { className } );

	return (
		<div { ...blockProps }>
      <h3>{__('Post Search Form', 'gutenberg-block-showcase')}</h3>
			<PostSearchForm className="search-demo" onChange={ () => null } />

      <h3>{__('Post Search Modal', 'gutenberg-block-showcase')}</h3>
      <PostSearchModal
				isVisible={ modalOpen }
        className="search-demo"
        onChange={() => {
					setModalOpen( false );
        }}
				onRequestClose={ () => setModalOpen( false ) }
      />
      <Button
        onClick={() => setModalOpen(true)}
        variant="primary"
      >
        {__('Toggle Search Modal', 'gutenberg-block-showcase')}
      </Button>
		</div>
	);
}

Edit.propTypes = {
	clientId: PropTypes.string.isRequired,
};

export default Edit;
