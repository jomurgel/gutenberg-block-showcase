/**
 * External dependencies.
 */
import { parseISO, endOfMonth, startOfMonth } from 'date-fns';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies.
 */
import { useState, useMemo } from '@wordpress/element';
import { useEntityProp } from '@wordpress/core-data';
import { Button, Dropdown } from '@wordpress/components';
import {
	useBlockProps,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalPublishDateTimePicker as PublishDateTimePicker,
} from '@wordpress/block-editor';
import { postDate } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { getSettings } from '@wordpress/date';
import {
	PostScheduleCheck,
	usePostScheduleLabel as PostScheduleLabel,
} from '@wordpress/editor';

/**
 * Styles.
 */
import './edit.scss';

/**
 * The edit function for gbs/post-date block.
 *
 * @param {Object}   props               Props.
 * @param {Function} props.setAttributes Block attributes setter.
 */
function Edit( { setAttributes } ) {
	/**
	 * Current parent block props.
	 */
	const blockProps = useBlockProps();

	/**
	 * Get the post type to pass to the entity provider.
	 *
	 * @see https://github.com/WordPress/gutenberg/blob/8d46fcdfdb929739b10ffe715073d15db5123ff9/packages/core-data/src/entity-provider.js#L91
	 */
	const { postType } = useSelect(
		( select ) => ( {
			postType: select( 'core/editor' ).getCurrentPostType(),
			isPublishing: select( 'core/editor' ).isPublishingPost(),
		} ),
		[]
	);

	/**
	 * Fetch the post date entity and setter.
	 */
	const [ date, setDate ] = useEntityProp( 'postType', postType, 'date' );

	/**
	 * Local state.
	 */
	const [ previewedMonth, setPreviewedMonth ] = useState(
		startOfMonth( new Date( date ) )
	);

	/**
	 * Use internal state instead of a ref to make sure that the component
	 * re-renders when the popover's anchor updates.
	 */
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );

	/**
	 * Memoize popoverProps to avoid returning a new object every time.
	 */
	const popoverProps = useMemo(
		() => ( { anchor: popoverAnchor } ),
		[ popoverAnchor ]
	);

	/**
	 * Pick up published and scheduled site posts.
	 */
	const eventsByPostType = useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords( 'postType', postType, {
				status: 'publish,future',
				after: startOfMonth( previewedMonth ).toISOString(),
				before: endOfMonth( previewedMonth ).toISOString(),
				exclude: [ select( 'core/editor' ).getCurrentPostId() ],
				per_page: 100,
				_fields: 'id,date',
			} ),
		[ previewedMonth, postType ]
	);

	/**
	 * Get calendar events.
	 */
	const events = useMemo(
		() =>
			( eventsByPostType || [] ).map( ( { date: eventDate } ) => ( {
				date: new Date( eventDate ),
			} ) ),
		[ eventsByPostType ]
	);

	/**
	 * Date settings.
	 */
	const settings = getSettings();

	/**
	 * To know if the current timezone is a 12 hour time with look for "a" in the time format
	 * We also make sure this a is not escaped by a "/".
	 */
	const is12HourTime = /a(?!\\)/i.test(
		settings.formats.time
			.toLowerCase() // Test only the lower case a.
			.replace( /\\\\/g, '' ) // Replace "//" with empty strings.
			.split( '' )
			.reverse()
			.join( '' ) // Reverse the string and test for "a" not followed by a slash.
	);

	return (
		<div { ...blockProps } ref={ setPopoverAnchor }>
			<PostScheduleCheck>
				<Dropdown
					className="post-date__wrapper"
					popoverProps={ popoverProps }
					renderContent={ () => (
						<PublishDateTimePicker
							__nextRemoveHelpButton
							__nextRemoveResetButton
							currentDate={ date }
							events={ events }
							is12Hour={ is12HourTime }
							onChange={ ( next ) => {
								setAttributes( { manualDate: next } );
								setDate( next );
							} }
							onMonthPreviewed={ ( next ) =>
								setPreviewedMonth( parseISO( next ) )
							}
						/>
					) }
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button
							aria-expanded={ isOpen }
							className="post-date"
							icon={ postDate }
							onClick={ onToggle }
							variant="tertiary"
						>
							<PostScheduleLabel />
						</Button>
					) }
				/>
			</PostScheduleCheck>
		</div>
	);
}

Edit.propTypes = {
	attributes: PropTypes.shape( {
		manualDate: PropTypes.string,
	} ).isRequired,
	setAttributes: PropTypes.func.isRequired,
};

export default Edit;
