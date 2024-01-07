(function (Drupal, $) {

  "use strict";

  Drupal.behaviors.tinymceBackport = {
    attach: function (context, settings) {
      if (settings.tinymcebackport) {
        for (const myid in settings.tinymcebackport) {
          if (settings.ckeditor && typeof settings.ckeditor.elements != 'undefined') {
            if (settings.ckeditor.elements.hasOwnProperty(myid)) {
              console.log('CKEditor already attached, not attaching TinyMCE');
              continue;
            }
          }

          const enabledFormats = settings.tinymcebackport[myid]['enabled_formats'];
          const $formatToggle = $('#' + settings.tinymcebackport[myid]['idSelector'] + ' select');
          const options = settings.tinymcebackport[myid]['options'];
          options.selector = '#' + myid;
          let currentVal = $formatToggle.val();

          if (enabledFormats.includes(currentVal)) {
            tinymce.init(options);
          }
          $formatToggle.on('change', function (e) {
            currentVal = $(this).val();
            if (enabledFormats.includes(currentVal)) {
              // TinyMCE takes care to not attach multiple times.
              tinymce.init(options);
            }
            else {
              tinymce.remove(options.selector);
            }
          });
        }
      }
    },
    detach: function (context, settings, trigger) {
      // AJAX on a form runs detach and attach on any element on that page, but
      // we don't have the id of the current editor. Removing all editors is
      // weird and causes visual jumping. Don't do it for now.
      if (trigger == 'serialize') {
        tinymce.triggerSave();
      }
    }
  }

})(Drupal, jQuery);
