/**
 * External dependencies.
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { PostTaxonomiesHierarchicalTermSelector } from '@wordpress/editor';
import { useBlockProps } from '@wordpress/block-editor';
import { decodeEntities } from '@wordpress/html-entities';
import { Placeholder, SelectControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore, useEntityProp } from '@wordpress/core-data';
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { speak } from '@wordpress/a11y';

/**
 * External dependencies.
 */
import { get } from 'lodash';

/**
 * Hooks.
 */
import useTaxonomy from '../../hooks/use-taxonomy';

/**
 * Components.
 */
import LockableFlatTermSelector from '../../components/lockable-flat-term-selector';
import MostUsedTerms from '../../components/lockable-flat-term-selector/components/most-used-terms';

/**
 * Services.
 */
import commaSeparate from '../../utils/comma-separate';

/**
 * Styles.
 */
import './edit.scss';

/**
 * The edit function for postTerms.
 *
 * @param {Object}  props                     Block props.
 * @param {Object}  props.attributes          Block attributes.
 * @param {string}  props.attributes.term     Optional term type.
 * @param {boolean} props.attributes.isLocked Optional lock state.
 * @param {boolean} props.isSelected          Is block selected?
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 */
function Edit( {
	attributes: { term = 'post_tag', isLocked = false },
	isSelected,
} ) {
	/**
	 * Get function to return post type registration details.
	 */
	const { getTaxonomy } = useSelect( coreStore );

	/**
	 * Local state.
	 */
	const [ blockSelected, setBlockSelected ] = useState( false );
	const [ filteredArray, setFilteredArray ] = useState( [] );

	/**
	 * A wrapper for getEntityRecord to get post type registration details and leverages entity types.
	 *
	 * @see https://github.com/WordPress/gutenberg/blob/b115040cc717b843500a45d8577d413f1732ffa5/packages/core-data/src/index.js#L19
	 * @see https://github.com/WordPress/gutenberg/blob/b115040cc717b843500a45d8577d413f1732ffa5/packages/core-data/src/entity-types/type.ts
	 */
	const taxonomy = getTaxonomy( term );

	/**
	 * Find the block variation by name and get isFlat value.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#getblockvariations
	 */
	const isHierarchical = taxonomy?.hierarchical;

	/**
	 * Current parent block props.
	 */
	const blockProps = useBlockProps( {
		className: `is-term-${ isHierarchical ? 'hierarchical' : 'flat' }`,
	} );

	/**
	 * Get the post type to pass to the entity provider.
	 *
	 * @see https://github.com/WordPress/gutenberg/blob/8d46fcdfdb929739b10ffe715073d15db5123ff9/packages/core-data/src/entity-provider.js#L91
	 */
	const { postType } = useSelect(
		( select ) => ( {
			postId: select( 'core/editor' ).getCurrentPostId(),
			postType: select( 'core/editor' ).getCurrentPostType(),
		} ),
		[]
	);

	/**
	 * Get the taxonomy object for the selected term.
	 *
	 * @see https://github.com/WordPress/gutenberg/blob/c840e90376da5de3e73af9499571e66fc8f25ff4/packages/core-data/src/index.js#L22
	 */
	const selectedTerm = useTaxonomy( term, [ term ] );

	/**
	 * Dynamic meta key name based on taxonomy.
	 */
	const metaKey = selectedTerm ? `primary_${ selectedTerm.slug }` : null;
	/**
	 * List all taxonomies which needs a dropdown for primary term.
	 */
	const primaryDropdownTaxonomies = [
		'primary_variety_vip_category',
		'primary_variety_vip_tag',
		'primary_category',
		'primary_vertical',
	];

	/**
	 * Key used to link the selection to a post.
	 */
	const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );

	/**
	 * Get the existing meta field value.
	 */
	const metaValue = meta && metaKey ? meta[ metaKey ] : null;

	/**
	 * If we have a taxonomyRestBase value, get the terms for that taxonomy.
	 *
	 * @return Terms for the current taxonomy defined.
	 */
	const currentTerms = useSelect(
		( select ) =>
			selectedTerm
				? select( 'core/editor' ).getEditedPostAttribute(
						selectedTerm?.rest_base
				  )
				: [],
		[ selectedTerm ]
	);

	/**
	 * Get all the terms of taxonomy.
	 */
	const taxonomyTerms = useSelect(
		( select ) =>
			currentTerms?.length
				? select( 'core' ).getEntityRecords( 'taxonomy', term, {
						_fields: 'id,name',
						include: currentTerms,
						context: 'view',
				  } )
				: [],
		[ currentTerms, term ]
	);

	/**
	 * Helper for setMeta for onChange event.
	 *
	 * @param {string} key   Dirt meta key.
	 * @param {mixed}  value Updated onChange meta value.
	 */
	const setPostMeta = ( key, value ) => {
		setMeta( {
			...meta,
			[ key ]: value,
		} );
	};

	/**
	 * Placeholder label.
	 */
	const label = selectedTerm?.name
		? `${ sprintf(
				/* translators: term name */
				__( '%s Selector', 'gutenberg-block-showcase' ),
				selectedTerm?.name
		  ) }`
		: __( 'Term Selector', 'gutenberg-block-showcase' );

	/**
	 * Placeholder instructions.
	 */
	const instructions =
		! blockSelected && taxonomyTerms?.length
			? commaSeparate(
					taxonomyTerms.map( ( { name } ) => decodeEntities( name ) )
			  )
			: '';

	/**
	 * Custom Component: Taxonomy for the taxonomy wrapper.
	 */
	const TaxonomyComponent =
		// eslint-disable-next-line no-nested-ternary
		! taxonomy?.hierarchical
			? LockableFlatTermSelector
			: PostTaxonomiesHierarchicalTermSelector;

	/**
	 * Restrict the block to collapse once selected.
	 */
	useEffect( () => {
		if ( isSelected && ! blockSelected ) {
			setBlockSelected( true );
		}
	}, [ isSelected, blockSelected ] );

	/**
	 * If we have a taxonomyRestBase value, get the terms for that taxonomy.
	 */
	useEffect( () => {
		if ( taxonomyTerms?.length && currentTerms?.length ) {
			setFilteredArray(
				taxonomyTerms
					.filter( ( value ) => {
						return currentTerms.includes( value.id );
					} )
					.map( function ( obj ) {
						return { label: obj.name, value: obj.id };
					} )
			);
		}
	}, [ currentTerms, taxonomyTerms ] );

	/**
	 * Adds most used selected terms.
	 *
	 * @param {Object} newTerm Selected term id.
	 * @return {void}
	 */
	const appendTerm = ( newTerm ) => {
		if ( currentTerms.includes( newTerm.id ) ) {
			return;
		}

		const newTermIds = [ ...currentTerms, newTerm.id ];
		const termAddedMessage = sprintf(
			/* translators: %s: term name. */
			__( '%s added', 'term' ),
			get(
				taxonomy,
				[ 'labels', 'singular_name' ],
				term === 'post_tag' ? __( 'Tag' ) : __( 'Term' )
			)
		);

		speak( termAddedMessage, 'assertive' );
		onUpdateTerms( newTermIds );
	};

	/**
	 * Dispatchers.
	 */
	const { editPost } = useDispatch( 'core/editor' );

	/**
	 * OnChange handler for updating the post..
	 *
	 * @param {Array} newTermIds Array of terms to save.
	 */
	function onUpdateTerms( newTermIds ) {
		editPost( { [ taxonomy.rest_base ]: newTermIds } );
	}

	return (
		<div { ...blockProps }>
			<div className="component-container">
				<Placeholder
					instructions={ instructions }
					isColumnLayout
					label={ label }
				>
					{ blockSelected ? (
						<div className="component-wrapper">
							<div
								className="term-list-container"
								style={ {
									display: 'grid',
									width: '100%',
								} }
							>
								<TaxonomyComponent
									isLocked={ isLocked }
									slug={ term }
								/>
								{ true === taxonomy?.hierarchical ? (
									<MostUsedTerms
										onSelect={ appendTerm }
										taxonomy={ taxonomy }
									/>
								) : null }
							</div>
							{ currentTerms?.length > 1 &&
							taxonomyTerms?.length &&
							primaryDropdownTaxonomies.includes( metaKey ) ? (
								<div className="primary-term">
									<SelectControl
										label={
											selectedTerm && selectedTerm.name
												? sprintf(
														/* translators: taxonomy name */
														__(
															'Primary %s',
															'gutenberg-block-showcase'
														),
														selectedTerm?.name
												  )
												: ''
										}
										onChange={ ( value ) =>
											setPostMeta( metaKey, value )
										}
										options={ filteredArray || [] }
										value={ metaValue }
									/>
								</div>
							) : null }
						</div>
					) : null }
				</Placeholder>
			</div>
		</div>
	);
}

Edit.propTypes = {
	attributes: PropTypes.shape( {
		isLocked: PropTypes.bool,
		term: PropTypes.string,
	} ).isRequired,
	isSelected: PropTypes.bool.isRequired,
};

export default Edit;
