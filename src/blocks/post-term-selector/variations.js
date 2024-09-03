/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { postCategories, category, tag } from '@wordpress/icons';

const variations = [
	{
		name: 'category',
		title: __( 'GBS Post Categories', 'gutenberg-block-showcase' ),
		description: __( "Display a post's categories.", 'gutenberg-block-showcase' ),
		icon: postCategories,
		attributes: { term: 'category' },
		isActive: ( blockAttributes ) => blockAttributes.term === 'category',
	},
	{
		name: 'post_tag',
		title: __( 'GBS Post Tags', 'gutenberg-block-showcase' ),
		description: __( "Display a post's tags.", 'gutenberg-block-showcase' ),
		isDefault: true,
		icon: tag,
		attributes: { term: 'post_tag' },
		isActive: ( blockAttributes ) => blockAttributes.term === 'post_tag',
	},
];

export default variations;
