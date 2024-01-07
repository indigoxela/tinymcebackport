<?php
/**
 * @file
 * API documentation for TinyMCE backport.
 */

/**
 * Override default TinyMCE options.
 *
 * @param array $options
 *   Options for TinyMCE before the get passed as JS setting.
 * @param string $format
 *   Text format name.
 */
function hook_tinymcebackport_options_alter(array &$options, $format) {
  // Turn off the spellckeck provided by the browser.
  $options['browser_spellcheck'] = FALSE;
  // Add styles applied to editor content.
  $options['content_css'][] = '/themes/bartik/css/style.css';
  // Only for this format.
  if ($format == 'filterd_html') {
    // Also load the table plugin.
    $options['plugins'] .= ' table';
    // Overhaul toolbar.
    $options['toolbar'] = 'undo redo bold italic blockquote styles bullist numlist link unlink imce';
    // Add the menubar above toolbar.
    $options['menubar'] = TRUE;
  }
}

/**
 * Add or remove formats, where this editor should be attached.
 *
 * @param array $enabled_formats
 *   Simple array of strings, per default "filtered_html" is the only item.
 */
function hook_tinymcebackport_enabled_formats_alter(array &$enabled_formats) {
  $enabled_formats[] = 'full_html';
}
