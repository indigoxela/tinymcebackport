/**
 * @file
 * TinyMCE IMCE file picker  plugin.
 */

"use strict";

const imageTypes = ['jpeg', 'jpg', 'gif', 'png', 'webp'];

tinymce.PluginManager.add('imce', function(editor, url) {
  editor.on('PreInit', function () {
    editor.options.register('imceUrl', { processor: 'string' });
    let styleformats = editor.options.get('style_formats');

    const imceFilePicker = function (callback, value, meta) {
      editor.windowManager.openUrl({
        title: 'File picker',
        url: editor.options.get('imceUrl')
      });
      window.addEventListener('message', function (event) {
        if (event.origin !== window.location.origin) {
          return;
        }
        if (meta.filetype == 'image') {
          if (!imageTypes.includes(event.data.ext)) {
            editor.notificationManager.open({
              text: 'Not an image',
              type: 'error',
              icon: 'warn'
            });
            editor.windowManager.close();
            return;
          }
          callback(event.data.url, {
            width: event.data.width,
            height: event.data.height
          });
          return;
        }
        if (meta.filetype == 'file') {
          callback(event.data.url, { text: event.data.name });
        }
      }, false);
    }
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
function tinymceImceResponseHandler (file, win) {
  let editor = tinymce.activeEditor;
  let extension = file.name.toLowerCase().split('.').pop();
  let result = {
    url: file.url,
    ext: extension,
    name: file.name
  }
  if (imageTypes.includes(extension)) {
    result.width = file.width + '';
    result.height = file.height + '';
  }
  window.parent.postMessage(result, window.location.origin);

  editor.windowManager.close();
}
