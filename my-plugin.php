<?php

/**
 * Plugin Name:       Example tweak editor
 * Description:
 * Requires at least: 6.6
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Lovro Hrust
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       example-static
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


/**
 * enqueue script
 */
add_action('enqueue_block_editor_assets', function() {
	wp_enqueue_script(
		'editor-tweak',
		plugins_url( 'editor-tweak.js', __FILE__ ),
		array( 'wp-blocks', 'wp-element', 'wp-editor' )
	);
});

//  another solution would be with user meta, not yet figured out how
// var_dump(get_user_meta(1, 'wp_persisted_preferences', false));
