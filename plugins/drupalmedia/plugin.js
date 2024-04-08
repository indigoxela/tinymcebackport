/**
 * @file
 * TinyMCE Drupal media browser plugin.
 */
(function () {

  'use strict';

  tinymce.PluginManager.add('drupalmedia', function(editor, url) {
    editor.on('PreInit', function () {
      editor.options.register('mediaBrowseUrl', { processor: 'string' });

      const mediaBrowser = function (callback, value, meta) {
        // Controller to remove event listener. Prevent multiple events attached.
        const controller = new AbortController();

        // Let TinyMCE communicate with Drupal media.
        window.addEventListener('message', function (event) {
          if (event.origin !== window.location.origin) {
            return;
          }
          let mediaType = event.data.type;
          if (meta.filetype === 'image' && mediaType === 'image') {
            callback(event.data.url, {
              width: event.data.width,
              height: event.data.height
            });
          }
          else if (meta.filetype === 'file') {
            callback(event.data.url, { text: event.data.name });
          }
          else if (meta.filetype === 'media' && (mediaType === 'video' || mediaType === 'audio')) {
            callback(event.data.url, {});
          }
          editor.windowManager.close();
          // Job done, remove listener.
          controller.abort();
        }, { signal: controller.signal }, false);

        // Open a TinyMCE dialog with media browser.
        editor.windowManager.openUrl({
          title: 'Media browser',
          url: editor.options.get('mediaBrowseUrl'),
          onCancel: function (api) {
            controller.abort();
          }
        });
      };
      editor.options.set('file_picker_callback', mediaBrowser);
    });
  });

})();
