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
  // Turn off the spellckeck provided by the browser (on by default).
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

  // Customized styles dropdown, can also contain custom styles.
  // @see https://www.tiny.cloud/docs/tinymce/latest/user-formatting-options/#style_formats
  $options['style_formats'] = array(
    array(
      'title' => 'Paragraph',
      'format' => 'p',
    ),
    array(
      'title' => 'Heading 3',
      'format' => 'h3',
    ),
    array(
      'title' => 'Pre',
      'format' => 'pre',
    ),
    // A custom inline style, wraps a span and sets a class for selected text.
    array(
      'name' => 'my-custom',
      'title' => 'My custom',
      'inline' => 'span',
      'classes' => 'my-custom',
    ),
    // Adds CSS class to paragraph tags. Actual styles are supposed to ship with
    // the theme.
    array(
      'name' => 'special-p',
      'title' => 'Special paragraph',
      'block' => 'p',
      'classes' => 'my-special-para',
    ),
  );

  // Based on user/role.
  global $user;
  if (!in_array('administrator', $user->roles)) {
    // Mini toolbar only, different order.
    $options['toolbar'] = 'styles bold italic blockquote bullist numlist link unlink';
    // Restrict content on input, pasted markup will get cleaned up accordingly.
    // @see https://www.tiny.cloud/docs/tinymce/latest/content-filtering/#valid_elements
    $options['valid_elements'] = '@[class],a[!href],em,strong,cite,blockquote,ul,ol,li,h3,pre,#p,-span';
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
