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
    // Available plugins, that ship with this install:
    // @code
    // accordion advlist anchor autolink autoresize autosave charmap code
    // codesample directionality emoticons fullscreen help image importcss
    // insertdatetime link lists media nonbreaking pagebreak preview quickbars
    // save searchreplace table template visualblocks visualchars wordcount
    // @endcode
    $options['plugins'] .= ' table';
    // Overhaul toolbar.
    // @see https://www.tiny.cloud/docs/tinymce/latest/available-toolbar-buttons/
    $options['toolbar'] = 'undo redo | styles | bold italic bullist numlist link unlink';
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

  // Custom CSS classes for image alignment. Defaults to image-left,
  // image-center, image-right. But you can override.
  // This does NOT provide the CSS for images, only sets classes.
  $options['image_align_classes'] = array(
    'left' => 'my-left',
    'center' => 'my-center',
    'right' => 'my-right',
  );

  // Enable media, video and audio.
  // @see https://www.tiny.cloud/docs/tinymce/latest/media/
  $options['plugins'] .= ' media';
  // Enable IMCE as file picker also for media.
  $options['file_picker_types'] = 'file image media';

  // Based on user ID or role. Same text format, different setup.
  global $user;
  if (!$user->uid) {
    // No image alignment for anonymous.
    $options['plugins'] = 'lists link image autoresize';
    unset($options['external_plugins']['imgalign']);

    // Restrict content on input, pasted markup will get cleaned up accordingly.
    // Use this, if you can't trust user input.
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
