/**
 * @file
 * TinyMCE IMCE plugin.
 */
(function () {

  'use strict';

  // Custom icons to register later.
  const icons = {};
  icons.floatnone = '<svg width="20" height="17" version="1.1" viewBox="0 0 20 17" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="2"><path d="m1 1h9v10h-9z" stroke-linecap="square"/><path d="m13 11h7"/><path d="m0 16h20"/></g></svg>';
  icons.aligncenter = '<svg width="20" height="17" version="1.1" viewBox="0 0 20 17" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="5" width="10" height="7" stroke-linecap="round"/><path d="m0 16h20"/><path d="m0 1h20"/></g></svg>';
  icons.floatleft = '<svg width="20" height="17" version="1.1" viewBox="0 0 20 17" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="1" width="9" height="10" stroke-linecap="round"/><g><path d="m13 11h7"/><path d="m0 16h20"/><path d="m13 1h7"/><path d="m13 6h7"/></g></g></svg>';
  icons.floatright = '<svg width="20" height="17" version="1.1" viewBox="0 0 20 17" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="10" y="1" width="9" height="10" stroke-linecap="round"/><g><path d="m7 11h-7"/><path d="m0 16h20"/><path d="m7 1h-7"/><path d="m7 6h-7"/></g></g></svg>';

  /**
   * Check if this node is an image to handle.
   */
  const isRegularImg = function (node) {
    if (node.nodeName != 'IMG') {
      return false;
    }
    if (node.hasAttribute('data-mce-object') || node.hasAttribute('data-mce-placeholder')) {
      return false;
    }
    if (node.src.startsWith('data:')) {
      return false;
    }
    return true;
  }

  /**
   * Get current image alignment.
   */
  const getImageAlign = function (node) {
    if (node.classList.length) {
      if (node.classList.contains('img-left')) {
        return 'left';
      }
      if (node.classList.contains('img-center')) {
        return 'center';
      }
      if (node.classList.contains('img-right')) {
        return 'right';
      }
    }
    return 'none';
  }

  tinymce.PluginManager.add('imgalign', function(editor, url) {
    // Register icons
    editor.on('PreInit', function () {
      for (let name in icons) {
        editor.ui.registry.addIcon(name, icons[name]);
      }
      // Firefox and floated images. This has a side effect, but is crucial to
      // be able to delete the selecte image by keyboard.
      editor.on('ObjectSelected', function (obj) {
        if (obj.target.nodeName != 'IMG') {
          return;
        }
        editor.selection.select(obj.target);
      });
    });

    // Dropdown button for the context toolbar.
    editor.ui.registry.addSplitButton('imgalign', {
      icon: 'floatnone',
      tooltip: 'Image alignment',
      onAction: function () {},
      onSetup: function (api) {
        let align = getImageAlign(editor.selection.getNode());
        let icon;
        switch (align) {
          case 'left':
            icon = 'floatleft';
            break;
          case 'center':
            icon = 'aligncenter';
            break;
          case 'right':
            icon = 'floatright';
            break;
          default:
            icon = 'floatnone';
        }
        api.setIcon(icon);
      },
      onItemAction: function (api, value) {
        let img = editor.selection.getNode();
        if (img.classList.contains('img-left')) {
          img.classList.remove('img-left');
        }
        if (img.classList.contains('img-right')) {
          img.classList.remove('img-right');
        }
        if (img.classList.contains('img-center')) {
          img.classList.remove('img-center');
        }
        if (value !== 'none') {
          img.classList.add('img-' + value);
        }
        editor.nodeChanged();
        // This fixes a side effect of the workaround for Firefox.
        editor.focus();
      },
      select: function (value) {
        let align = getImageAlign(editor.selection.getNode());
        if (!align && value == 'none') {
          return true;
        }
        return align == value;
      },
      fetch: function (callback) {
        const items = [
          {
            type: 'choiceitem',
            text: 'No alignment',
            icon: 'floatnone',
            value: 'none'
          },
          {
            type: 'choiceitem',
            text: 'Align left',
            icon: 'floatleft',
            value: 'left'
          },
          {
            type: 'choiceitem',
            text: 'Align center',
            icon: 'aligncenter',
            value: 'center'
          },
          {
            type: 'choiceitem',
            text: 'Align right',
            icon: 'floatright',
            value: 'right'
          }
        ];
        callback(items);
      }
    });

    // The context toolbar for images.
    editor.ui.registry.addContextToolbar('imgaligncontext', {
      predicate: function (node) {
        return isRegularImg(node);
      },
      items: 'imgalign',
      scope: 'node',
      position: 'node'
    });
  });

})();