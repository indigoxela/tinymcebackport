/**
 * @file
 * TinyMCE IMCE file picker plugin.
 */
(function () {

  'use strict';

  const imageTypes = ['jpeg', 'jpg', 'gif', 'png', 'webp'];

  tinymce.PluginManager.add('imce', function(editor, url) {
    editor.on('PreInit', function () {
      editor.options.register('imceUrl', { processor: 'string' });

      const imceFilePicker = function (callback, value, meta) {
        // Controller to remove event listener. Prevent multiple events attached.
        const controller = new AbortController();
        // Let TinyMCE communicate with IMCE.
        window.addEventListener('message', function (event) {
          if (event.origin !== window.location.origin) {
            return;
          }
          if (meta.filetype === 'image') {
            if (!imageTypes.includes(event.data.ext)) {
              // Can't show a message as we're still in a dialog, message would
              // be below.
              return;
            }
            callback(event.data.url, {
              width: event.data.width,
              height: event.data.height
            });
          }
          else if (meta.filetype === 'file') {
            callback(event.data.url, { text: event.data.name });
          }
          else if (meta.filetype === 'media') {
            let dimensions = {};
            if (typeof event.data.width !== 'undefined') {
              dimensions.width = event.data.width;
              dimensions.height = event.data.height;
            }
            callback(event.data.url, dimensions);
          }
          // Job done, remove listener.
          controller.abort();
        }, { signal: controller.signal }, false);

        // Open a TinyMCE dialog with IMCE.
        editor.windowManager.openUrl({
          title: 'File picker',
          url: editor.options.get('imceUrl'),
          onCancel: function (api) {
            controller.abort();
          }
        });
      };
      editor.options.set('file_picker_callback', imceFilePicker);
    });
  });

  /**
   * Callback to which IMCE will respond, set via imceUrl param.
   *
   * @param object file
   *   File related data returned from IMCE.
   * @param object win
   *   Unused here.
   */
  window.tinymceImceResponseHandler = function (file, win) {
    if (!file || !file.url) {
      return;
    }
    let editor = tinymce.activeEditor;
    let extension = file.name.toLowerCase().split('.').pop();
    let result = {
      url: file.url,
      ext: extension,
      name: file.name
    };
    if (imageTypes.includes(extension)) {
      // IMCE fails to provide dimensions for webp, TinyMCE takes care of them.
      if (result.width) {
        result.width = file.width + '';
        result.height = file.height + '';
      }
    }
    let videoTypes = ['mp4', 'webm'];
    if (videoTypes.includes(extension)) {
      result.width = '600';
      result.height = '360';
    }
    window.parent.postMessage(result, window.location.origin);

    editor.windowManager.close();
  };

})();
