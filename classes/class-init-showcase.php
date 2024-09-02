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
	 * Path to the build directory
	 *
	 * @var string
	 */
	private $build_directory;

	/**
	 * Other editor services.
	 *
	 * @var array
	 */
	private array $_services = [
		'sidebars',
		'filters',
		'slotfills',
	];

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
		$this->build_directory = GOOTS_DIR . 'build/blocks/';

		add_action( 'init', [ $this, 'register_all_blocks' ] );
    add_action( 'enqueue_block_editor_assets', [ $this, 'register_services'] );
		add_filter( 'block_categories_all', [ $this, 'filter_block_categories' ] );
	}

	/**
	 * Register all blocks.
	 */
	public function register_all_blocks(): void {
		// Check if the build directory exists.
		if ( ! is_dir( $this->build_directory ) ) {
				return;
		}

		// Get all directories within the build directory.
		$blocks = glob( $this->build_directory . '*', GLOB_ONLYDIR );

		// Loop through each directory and register it as a block.
		foreach ( $blocks as $block_path ) {
				$block_name = basename( $block_path );
				$this->register_block( $block_name );
		}
	}

	/**
	 * Function to register a single block.
	 *
	 * @param string $block_name block slug.
	 */
	public function register_block( string $block_name ) {
		$block_path = $this->build_directory . $block_name;

		// Register the block using the block's directory.
		if ( is_dir( $block_path ) ) {
			register_block_type( $block_path );
		}
	}

  /**
   * Auto-registers services that aren't blocks.
   */
	public function register_services(): void {
		// Registered all services where we have only scripts and style.
		foreach ( $this->_services as $service ) {
			$service_directory = GOOTS_DIR . "build/{$service}/";

			// Check if the build directory exists.
			if ( ! is_dir( $service_directory ) ) {
				continue;
			}

			$features = glob( $service_directory . '*', GLOB_ONLYDIR );

			// Loop through each directory and register it as a block.
      foreach ( $features as $feature_path ) {
        $feature_name = basename( $feature_path );
        $this->init_script( $service_directory, $service, $feature_name );
      }
		}
	}

  /**
   * Init scripts, enqueue assets.
   */
  public function init_script( string $directory, string $service, string $name ): void {
    $script_location =  $directory . $name;

    // Bail if no directory exists.
		if ( ! is_dir( $script_location ) ) {
      return;
    }

    $handle = $service . '-' . $name;

    $dependencies   = [];
    $hash           = '';
    $asset_location = GOOTS_PATH . "build/{$service}/$name/";
		$script_asset   = $asset_location . 'index.asset.php';
		$script_js      = $asset_location . 'index.js';
		$script_js_dir  = $script_location . '/index.js';
		$style_css      = $asset_location . 'index.css';
		$style_css_dir  = $script_location . '/index.css';

        // Check if the file exists.
    // @todo: this could be a helper function.
    if ( file_exists( $script_asset ) ) {
      // Include the file and get its contents.
      $asset_data = include $script_asset;

      // Check if 'dependencies' key exists.
      if ( isset( $asset_data['dependencies'] ) ) {
          $dependencies = $asset_data['dependencies'];
      }

      // Check if the 'version' key exists.
      if ( isset( $asset_data['version'] ) ) {
          $hash = $asset_data['version'];
      }
  }

		if ( file_exists( $script_js_dir ) ) {
			// Don't register if the js path is not valid.
			wp_enqueue_script(
				$handle,
				$script_js,
				$dependencies,
        $hash,
        [
          'strategy' => 'async',
          'in_footer' => true
        ]
			);

			// Don't register if the style css path is not valid.
			if ( file_exists( $style_css_dir ) ) {
				wp_enqueue_style(
					$handle,
					$style_css,
					[],
					$hash
				);
			}
		}
  }

	/**
	 * Add new block category.
	 *
	 * @param array $block_categories Array of registered block categories.
	 */
	public function filter_block_categories( array $block_categories = [] ): array {
		$block_categories[] = [
			'slug'  => 'showcase',
			'title' => __( 'Showcase Blocks', 'gutenberg-block-showcase' ),
			'icon'  => '<svg viewBox="0 0 2884 2884" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"><path style="fill:none" d="M0 0h800v800H0z" transform="scale(3.60441)"/><path d="M.749.31C.695.268.623.116.569-.01l.009.083a.027.027 0 0 1-.009.023.029.029 0 0 1-.025.006A8.662 8.662 0 0 1 .462.078L.446.165.443.178A.027.027 0 0 1 .411.2.027.027 0 0 1 .39.168L.393.154C.399.12.406.089.41.061a1.745 1.745 0 0 1-.247-.105C.043-.108-.011-.171.002-.229.01-.268.037-.295.08-.308a.221.221 0 0 1 .059-.008c.088 0 .194.044.246.094a.273.273 0 0 1 .084.245L.52.039.495-.202a.027.027 0 0 1 .021-.029.028.028 0 0 1 .032.017c.028.078.094.245.154.362A.274.274 0 0 0 .697.12C.674-.012.68-.107.715-.163A.026.026 0 0 1 .74-.176c.01.001.019.007.023.017a.814.814 0 0 0 .068.136L.83-.071c.002-.095.02-.153.056-.176.013-.008.03-.005.038.008a.027.027 0 0 1-.008.037C.883-.181.878-.057.891.047a.027.027 0 0 1-.01.025.03.03 0 0 1-.027.004C.835.068.805.047.756-.045l-.015-.03a.995.995 0 0 0 .05.355.027.027 0 0 1-.01.031.03.03 0 0 1-.015.005A.027.027 0 0 1 .749.31ZM.095-.256c-.023.007-.036.02-.04.039-.005.023.027.068.134.126.062.033.14.066.227.096a.217.217 0 0 0-.069-.188.331.331 0 0 0-.208-.078.152.152 0 0 0-.044.005Zm.851-.007c0-.015.012-.027.027-.027S1-.278 1-.263a.028.028 0 0 1-.027.028.028.028 0 0 1-.027-.028Z" style="fill:#000;fill-rule:nonzero" transform="matrix(2578.08309 0 0 -2578.08309 152.723 1441.764)"/></svg>',
		];

		return $block_categories;
	}
}
