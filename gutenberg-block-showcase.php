<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://jomurgel.com
 * @since             1.0.0
 * @package           gutenberg-block-showcase
 *
 * @wordpress-plugin
 * Plugin Name:       Gutenberg Block Showcase
 * Plugin URI:        https://github.com/jomurgel/gutenberg-block-showcase
 * Description:       A showcase of Gutenberg features or blocks built during my tenure as a WordPress engineer.
 * Version:           1.0.0
 * Author:            Jo Murgel
 * Author URI:        https://jomurgel.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       gutenberg-block-showcase
 * Domain Path:       /languages
 */

declare( strict_types = 1 );

namespace Goots;

use Goots\Init_Showcase;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'GOOTS_DIR', plugin_dir_path( __FILE__ ) );
define( 'GOOTS_PATH', plugin_dir_url( __FILE__ ) );

require_once GOOTS_DIR . '/classes/class-init-showcase.php';
require_once GOOTS_DIR . '/classes/class-post-type-showcase.php';

if ( class_exists( '\\Goots\\Init_Showcase' ) ) {
  Init_Showcase::init();
}

if ( class_exists( '\\Goots\\Showcase_Post_Type' ) ) {
  Showcase_Post_Type::init();
}
