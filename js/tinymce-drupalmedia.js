/**
 * @file
 * Override method from Media module.
 */
(function (Drupal, $) {
  "use strict";

  Drupal.media.browser.submit = function (event) {
    // If we have a field context, this isn't triggered by the editor. Do what
    // the original function does then and jump out.
    let $fieldContext = $(parent.window.document.body).find('#mediaBrowser');
    if ($fieldContext.length) {
      let $buttons = $fieldContext.parent('.ui-dialog').find('.ui-dialog-buttonpane button');
      $buttons[0].click();
      return false;
    }

    event.preventDefault();
    let selection = Drupal.media.browser.selectedMedia;
    if (selection.length) {
      let file = selection[0];
      let result = {
        url: file.url,
        name: file.filename,
        alt: file.alt,
        type: file.type,
        ext: file.filename.toLowerCase().split('.').pop()
      };
      if (file.width && file.height) {
        result.width = file.width + '';
        result.height = file.height + '';
      }
      // Communicate with TinyMCE drupalmedia plugin.
      window.parent.postMessage(result, window.location.origin);
    }
  };
})(Drupal, jQuery);
