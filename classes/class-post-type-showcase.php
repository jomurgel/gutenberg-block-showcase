<?php
/**
 * Custom post type for the Showcase Demo.
 *
 * @package gutenberg-block-showcase
 */

declare( strict_types = 1 );

namespace Goots;

final class Showcase_Post_Type {

	/**
	 * Name of the custom post type.
	 *
	 * @var string
	 */
	public $name = 'showcase';

	/**
	 * Static method to initialize the class
	 */
	public static function init() {
		static $instance = null;

		if (null === $instance) {
				$instance = new self();
		}
		return $instance;
	}

	/**
	 * Class constructor.
	 */
	public function __construct() {
		$this->_setup_hooks();
	}

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	private function _setup_hooks(): void {
    add_action( 'init', [ $this, 'create_post_type' ] );
  }

	/**
	 * Creates the post type.
	 */
	public function create_post_type() {
    $labels = [
      'name'                  => _x( 'Showcase', 'Post Type General Name', 'gutenberg-block-showcase' ),
      'singular_name'         => _x( 'Showcase', 'Post Type Singular Name', 'gutenberg-block-showcase' ),
      'menu_name'             => __( 'Showcase', 'gutenberg-block-showcase' ),
      'name_admin_bar'        => __( 'Showcase', 'gutenberg-block-showcase' ),
      'archives'              => __( 'Showcase Archives', 'gutenberg-block-showcase' ),
      'attributes'            => __( 'Showcase Attributes', 'gutenberg-block-showcase' ),
      'parent_item_colon'     => __( 'Parent Showcase:', 'gutenberg-block-showcase' ),
      'all_items'             => __( 'All Showcases', 'gutenberg-block-showcase' ),
      'add_new_item'          => __( 'Add New Showcase', 'gutenberg-block-showcase' ),
      'add_new'               => __( 'Add New Showcase', 'gutenberg-block-showcase' ),
      'new_item'              => __( 'New Showcase', 'gutenberg-block-showcase' ),
      'edit_item'             => __( 'Edit Showcase', 'gutenberg-block-showcase' ),
      'update_item'           => __( 'Update Showcase', 'gutenberg-block-showcase' ),
      'view_item'             => __( 'View Showcase', 'gutenberg-block-showcase' ),
      'view_items'            => __( 'View Showcase', 'gutenberg-block-showcase' ),
      'search_items'          => __( 'Search Showcase', 'gutenberg-block-showcase' ),
      'not_found'             => __( 'Not found', 'gutenberg-block-showcase' ),
      'not_found_in_trash'    => __( 'Not found in Trash', 'gutenberg-block-showcase' ),
      'featured_image'        => __( 'Featured Image', 'gutenberg-block-showcase' ),
      'set_featured_image'    => __( 'Set featured image', 'gutenberg-block-showcase' ),
      'remove_featured_image' => __( 'Remove featured image', 'gutenberg-block-showcase' ),
      'use_featured_image'    => __( 'Use as featured image', 'gutenberg-block-showcase' ),
      'insert_into_item'      => __( 'Insert into item', 'gutenberg-block-showcase' ),
      'uploaded_to_this_item' => __( 'Uploaded to this item', 'gutenberg-block-showcase' ),
      'items_list'            => __( 'Showcases list', 'gutenberg-block-showcase' ),
      'items_list_navigation' => __( 'Showcases list navigation', 'gutenberg-block-showcase' ),
      'filter_items_list'     => __( 'Filter Showcase list', 'gutenberg-block-showcase' ),
    ];

    $args = [
      'label'                 => __( 'Showcase', 'gutenberg-block-showcase' ),
      'description'           => __( 'Block showcase demo post type', 'gutenberg-block-showcase' ),
      'labels'                => $labels,
      'supports'              => [ 'title', 'editor', 'thumbnail', 'revisions', 'custom-fields' ],
      'taxonomies'            => [ 'category', 'post_tag' ],
      'hierarchical'          => false,
      'public'                => true,
      'show_ui'               => true,
      'show_in_menu'          => true,
      'menu_position'         => 5,
      'show_in_rest'          => true,
      'show_in_admin_bar'     => true,
      'show_in_nav_menus'     => true,
      'can_export'            => true,
      'has_archive'           => true,
      'exclude_from_search'   => false,
      'publicly_queryable'    => true,
      'capability_type'       => 'page',
      'template'              => [
        [ 'gbs/top-block' ],
        [ 'core/paragraph' ],
        [ 'gbs/bottom-block' ]
      ]
    ];

    register_post_type( $this->name, $args );
  }
}
