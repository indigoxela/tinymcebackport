(function (Drupal, $) {
  "use strict";

  Drupal.behaviors.tinymceBackport = {
    attach: function (context, settings) {
      if (settings.tinymcebackport) {
        if (settings.ckeditor && typeof settings.ckeditor.input_formats !== 'undefined') {
          let ckeFormats = Object.keys(settings.ckeditor.input_formats);
          if (ckeFormats.length) {
            let tinyFormats = Object.keys(settings.tinymcebackport);
            if (tinyFormats.length) {
              let intersection = tinyFormats.filter( function(item) {
                return ckeFormats.includes(item);
              });
              if (intersection.length) {
                console.warn('CKEditor is enabled for same formats as TinyMCE, so not attaching TinyMCE.');
                return;
              }
            }
          }
        }
        $('.text-format-wrapper').once('tinymce-init-textarea', function() {
          const textareaId = $(this).find('textarea:not(.text-summary)').attr('id');
          let $formatToggle = $(this).find('select.filter-list');
          let format = $formatToggle.val();
          if (format && typeof settings.tinymcebackport[format] !== 'undefined') {
            let options = settings.tinymcebackport[format].options;
            options.selector = '#' + textareaId;
            tinymce.init(options);
          }
          $formatToggle.bind('change', function (e) {
            let newVal = $formatToggle.val();
            if (typeof settings.tinymcebackport[newVal] !== 'undefined') {
              let newOptions = settings.tinymcebackport[newVal].options;
              newOptions.selector = '#' + textareaId;
              let activeEditor = tinymce.get(textareaId);
              if (activeEditor) {
                tinymce.triggerSave();
                activeEditor.remove();
              }
              tinymce.init(newOptions);
            }
            else {
              tinymce.remove('#' + textareaId);
            }
          });
        });
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
            if (trigger === 'move') {
              let $formatToggle = $(itemSelector).parents('.text-format-wrapper').find('select.filter-list');
              let format = $formatToggle.val();
              if (format && typeof settings.tinymcebackport[format] !== 'undefined') {
                let options = settings.tinymcebackport[format].options;
                options.selector = itemSelector;
                tinymce.init(options);
              }
            }
          }
        }
      }
    }
  };

})(Drupal, jQuery);
