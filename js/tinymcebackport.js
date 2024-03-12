(function (Drupal, $) {
  "use strict";

  Drupal.behaviors.tinymceBackport = {
    attach: function (context, settings) {
      if (settings.tinymcebackport) {
        for (const myid in settings.tinymcebackport) {
          if (settings.ckeditor && typeof settings.ckeditor.elements !== 'undefined') {
            if (settings.ckeditor.elements.hasOwnProperty(myid)) {
              console.log('CKEditor already attached, not attaching TinyMCE');
              continue;
            }
          }
          // Additional attach, may be triggered by AJAX fields on the page.
          if (tinymce.get(myid) !== null) {
            continue;
          }

          const enabledFormats = settings.tinymcebackport[myid].enabled_formats;
          const $formatToggle = $('#' + settings.tinymcebackport[myid].idSelector + ' select');
          const options = settings.tinymcebackport[myid].options;
          options.selector = '#' + myid;
          let currentVal = $formatToggle.val();

          if (enabledFormats.includes(currentVal)) {
            tinymce.init(options);
          }
          $formatToggle.bind('change', function (e) {
            let newVal = $formatToggle.val();
            if (enabledFormats.includes(newVal)) {
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
      if (trigger === 'serialize') {
        tinymce.triggerSave();
      }
      if (trigger === 'unload' || trigger === 'move') {
        let editorInstances = tinymce.get();
        for (let i = 0; i < editorInstances.length; i++) {
          let itemSelector = '#' + editorInstances[i].id;
          let isMultifield = $(itemSelector).parents('.field-multiple-table').length;
          // We only detach editors inside multivalue field wrappers to prevent
          // unnecessary visual jumping caused by any AJAX field on the page.
          if (isMultifield) {
            tinymce.remove(itemSelector);
          }
        }
      }
    }
  };

})(Drupal, jQuery);
