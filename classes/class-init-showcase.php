<?php
/**
 * Init Gutenberg functions.
 *
 * @package gutenberg-block-showcase
 */

declare( strict_types = 1 );

namespace Goots;

final class Init_Showcase {

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

	}
}
