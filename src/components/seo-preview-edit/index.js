/**
 * External dependencies.
 */
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';
import parse from 'html-react-parser';

/**
 * WordPress dependencies.
 */
import { Button, Flex } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { addCard } from '@wordpress/icons';
import { date } from '@wordpress/date';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useMemo, useState, useEffect } from '@wordpress/element';

/**
 * Components.
 */
import WordCount from '../word-count';

/**
 * SEO Edit component.
 * @param {Object} props            Props object.
 * @param {bool}   props.isSelected Is block/feature selected.
 * @param {Object} props.style      Style object.
 */
function SeoPreviewEdit( { isSelected, style } ) {
	/**
	 * Get the post type to pass to the entity provider.
	 *
	 * @see https://github.com/WordPress/gutenberg/blob/8d46fcdfdb929739b10ffe715073d15db5123ff9/packages/core-data/src/entity-provider.js#L91
	 */
	const postType = useSelect(
		( select ) => select( 'core/editor' ).getCurrentPostType(),
		[]
	);

	/**
	 * We're needing to fetch meta prior to our post object.
	 * Request so we can leverage meta change to trigger a useSelect update.
	 */
	const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );

	// Destructure meta for the seo title override.
	const {
		mt_seo_description: seoMetaExcerpt = '',
		mt_seo_title: seoMetaTitle = '',
		thr_post_headlines: seoThrDescription = '',
		'_variety-sub-heading': seoVarietyDescription = '',
	} = meta || {};

	/**
	 * Get current post object, as it's edited.
	 *
	 * @param {string} date        Published date string.
	 * @param {string} postExcerpt Default excerpt.
	 * @param {string} link        Default post url.
	 * @param {string} title       Default title.
	 * @see https://developer.wordpress.org/block-editor/
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/data/data-core-editor/#getcurrentpost
	 */
	const { published, link, title, postExcerpt } =
		useSelect( ( select ) => {
			const { getEditedPostAttribute } = select( 'core/editor' );
			return {
				date: getEditedPostAttribute( 'date' ),
				postExcerpt: getEditedPostAttribute( 'excerpt' ),
				link: getEditedPostAttribute( 'link' ),
				title: getEditedPostAttribute( 'title' ),
			};
		} ) || {};

	/**
	 * Set the default excerpt taking into consideration some brands that use a separate field.
	 */
	const excerpt = useMemo(
		() => postExcerpt || seoThrDescription || seoVarietyDescription || '',
		[ postExcerpt, seoThrDescription, seoVarietyDescription ]
	);

	/**
	 * Local state.
	 */
	const [ titleValue, setTitleValue ] = useState( seoMetaTitle );
	const [ excerptValue, setExcerptValue ] = useState( seoMetaExcerpt );

	// This will keep tabs on the nota-seo plugin changing SeoMetaTitle.
	// Trial isn't running on THR or VY, so no worried about alternate fields.
	useEffect( () => {
		setTitleValue( seoMetaTitle );
	}, [ seoMetaTitle ] );

	// This will keep tabs on the nota-seo plugin changing SeoMetaDescription.
	// Trial isn't running on THR or VY, so no worried about alternate fields.
	useEffect( () => {
		setExcerptValue( seoMetaExcerpt );
	}, [ seoMetaExcerpt ] );

	/**
	 * Set the seo title on change.
	 */
	useEffect( () => {
		// Only update the value when our local state does not match our global state.
		if ( titleValue === seoMetaTitle ) {
			return;
		}

		setMeta( {
			mt_seo_title: sanitizeHtml(
        titleValue || '',
        {
          allowedTags: ['b', 'em', 'i', 's', 'span', 'strong', 'u'],
          allowedAttributes: {
            span: ['data-*', 'style'],
          },
          allowedStyles: {
            /**
             *
             */
            span: {
              'text-decoration': [/^underline$/],
            },
          },
        }
      ), // eslint-disable-line camelcase
		} );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ titleValue ] );

	/**
	 * Set the seo description on change.
	 */
	useEffect( () => {
		// Sanitize the description.
		const nextDescription =
			sanitizeHtml( excerptValue, {
				allowedTags: [],
				textFilter: ( text ) =>
					text.replace(
						// replace &amp; with & to avoid escaping.
						/&amp;/g,
						'&'
					),
			} ) || '';

		// Only update the value when our local state does match our global state.
		if ( nextDescription === seoMetaExcerpt ) {
			return;
		}

		setMeta( {
			mt_seo_description: nextDescription, // eslint-disable-line camelcase
		} );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ excerptValue ] );

	return (
		<div className="seo-preview" style={ style }>
			<div className="seo-preview-container">
				<div className="seo-preview-date">
					<span
						style={ {
							fontSize: 'inherit',
							fontWeight: 700,
						} }
					>
						{ isSelected
							? __( 'Edit', 'gutenberg-block-showcase' )
							: __( 'Preview', 'gutenberg-block-showcase' ) }
					</span>
					<span className="seo-date">
						{ ` ( ${ date( 'M j, Y', published ) } ) ` }
					</span>
				</div>
				{ isSelected ? (
					<div className="seo-reset-container seo-title">
						<span>
							{ __( 'SEO Title (70 char max)', 'gutenberg-block-showcase' ) }
						</span>
						<Flex>
							<RichText
								allowedFormats={ [
									'core/bold',
									'core/italic',
									'core/strikethrough',
									'core/underline',
									'wpcom/underline',
								] }
								onChange={ ( next ) => setTitleValue( next ) }
								tagName="p"
								value={ titleValue }
							/>
							{ title ? (
								<Button
									icon={ addCard }
									label={ __(
										'Copy post title',
										'gutenberg-block-showcase'
									) }
									onClick={ () => setTitleValue( title ) }
								/>
							) : null }
						</Flex>
						<p className="components-base-control__help">
							{ __(
								'The text entered here will alter the <title> tag using the wp_title() function. Use %title% to include the original title or leave empty to keep original title.',
								'gutenberg-block-showcase'
							) }
						</p>
						<WordCount
							showRemainingAlert={ 70 }
							text={ titleValue }
						/>
					</div>
				) : (
					<div
						className="seo-title"
						style={ { textAlign: 'justify' } }
					>
						<span style={ { fontWeight: 500 } }>
							{ __( 'Title: ', 'gutenberg-block-showcase' ) }
						</span>
						<span>{ parse( titleValue ) }</span>
					</div>
				) }
				<div
					className={ `seo-url ${
						isSelected ? 'is-block-selected' : ''
					}` }
				>
					<a
						className="seo-link"
						href={ link }
						rel="noreferrer noopener"
						target="_blank"
					>
						{ link }
					</a>
					{ ' - ' }
					<span className="seo-cached-badge">
						{ __( 'Cached', 'gutenberg-block-showcase' ) }
					</span>
				</div>
				{ isSelected ? (
					<div className="seo-reset-container seo-description">
						<span>
							{ __(
								'SEO Description (150 char max)',
								'gutenberg-block-showcase'
							) }
						</span>
						<Flex>
							<RichText
								allowedFormats={ [] }
								onChange={ ( next ) => setExcerptValue( next ) }
								tagName="p"
								value={ excerptValue }
							/>
							{ excerpt ? (
								<Button
									icon={ addCard }
									label={ __(
										'Copy post excerpt',
										'gutenberg-block-showcase'
									) }
									onClick={ () => setExcerptValue( excerpt ) }
								/>
							) : null }
						</Flex>
						<p className="components-base-control__help">
							{ __(
								'This text will be used as description meta information. Left empty, a description is automatically generated.',
								'gutenberg-block-showcase'
							) }
						</p>
						<WordCount
							showRemainingAlert={ 150 }
							text={ excerptValue }
						/>
					</div>
				) : (
					<div
						className="seo-description"
						style={ { textAlign: 'justify' } }
					>
						<span>{ excerptValue }</span>
					</div>
				) }
			</div>
		</div>
	);
}

SeoPreviewEdit.defaultProps = {
	style: {},
};

SeoPreviewEdit.propTypes = {
	isSelected: PropTypes.bool.isRequired,
	style: PropTypes.shape( {} ),
};

export default SeoPreviewEdit;
