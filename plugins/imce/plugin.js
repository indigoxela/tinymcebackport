/**
 * @file
 * TinyMCE IMCE plugin.
 */
"use strict";

tinymce.PluginManager.add('imce', function(editor, url) {
  // Register icons and options to use later.
  editor.on('PreInit', function () {
    let icons = imceTools.icons;
    for (let name in icons) {
      editor.ui.registry.addIcon(name, icons[name]);
    }
    editor.options.register('imceUrl', { processor: 'string' });
  });

  // The toolbar button.
  editor.ui.registry.addToggleButton('imce', {
    icon: 'image',
    tooltip: 'Image...',
    onAction: function () {
      imceTools.openDialog(editor);
    },
    onSetup: function (api) {
      api.setActive(false);
      editor.on('SelectionChange', function () {
        let node = editor.selection.getNode();
        if (imceTools.isRegularImg(node)) {
          api.setActive(true);
        }
        else {
          api.setActive(false);
        }
      });
      // Fix broken drag/replace/remove in Firefox.
      editor.on('ObjectSelected', function (obj) {
        if (obj.target.nodeName != 'IMG') {
          return;
        }
        editor.selection.select(obj.target);
      });
    }
  });

  // The menu item for the menubar.
  editor.ui.registry.addMenuItem('imce', {
    icon: 'image',
    text: 'Image...',
    onAction: function () {
      imceTools.openDialog(editor);
    }
  });

  // Dropdown button for the context menu.
  editor.ui.registry.addSplitButton('imcealign', {
    icon: 'floatnone',
    tooltip: 'Alignment',
    onAction: function () {},
    onSetup: function (api) {
      let align = editor.selection.getNode().getAttribute('data-align');
      let icon;
      switch (align) {
        case 'left':
          icon = 'floatnone';
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
      img.setAttribute('data-align', value);
      editor.nodeChanged();
      // Why is the focus lost?
      editor.focus();
    },
    select: function (value) {
      let align = editor.selection.getNode().getAttribute('data-align');
      if (!align && value == 'none') {
        return true;
      }
      return align == value;
    },
    fetch: function (callback) {
      const items = [
        {
          type: 'choiceitem',
          text: 'No align',
          icon: 'floatnone',
          value: 'none'
        },
        {
          type: 'choiceitem',
          text: 'Float left',
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
          text: 'Float right',
          icon: 'floatright',
          value: 'right'
        }
      ];
      callback(items);
    }
  });

  // The button to open the form for alt text.
  editor.ui.registry.addButton('form:imcealtform', {
    type: 'contextformbutton'
  });
  // The form opened by above button.
  editor.ui.registry.addContextForm('imcealtform', {
    launch: {
      type: 'contextformbutton',
      icon: 'lowvision',
      text: '!!',
      tooltip: 'Alternative text',
      onSetup: function (api) {
        let alt = editor.selection.getNode().getAttribute('alt');
        if (alt) {
          api.setText('✓');
        }
      }
    },
    label: 'Image alternative text',
    initValue: function () {
      let img = editor.selection.getNode();
      return img.getAttribute('alt');
    },
    commands: [
      {
        type: 'contextformtogglebutton',
        text: 'Update ↵',
        primary: true,
        onAction: function (formApi) {
          const value = formApi.getValue();
          let img = editor.selection.getNode();
          img.setAttribute('alt', value);
          formApi.hide();
          editor.focus();// Why?
        }
      }
    ]
  });

  // The context toolbar for images.
  editor.ui.registry.addContextToolbar('imcecontext', {
    predicate: function (node) {
      return imceTools.isRegularImg(node);
    },
    items: 'form:imcealtform imcealign',
    scope: 'node',
    position: 'node'
  });
});

const imceTools = {}
/**
 * Check if this is an image to handle.
 *
 * @param object node
 *   Dom node.
 */
imceTools.isRegularImg = function (node) {
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
 * Opens a TinyMCE dialog which contains IMCE.
 */
imceTools.openDialog = function (editor) {
  editor.windowManager.openUrl({
    title: 'Image',
    url: editor.options.get('imceUrl')
  });
}

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
  let imageTypes = ['jpeg', 'jpg', 'gif', 'png', 'webp'];
  let extension = file.name.toLowerCase().split('.').pop();
  if (!imageTypes.includes(extension)) {
    editor.notificationManager.open({
      text: 'Not an image',
      type: 'error',
      icon: 'warn'
    });
    editor.windowManager.close();
    return;
  }
  let img = editor.dom.create('img', {
    src: file.url,
  });
  // Only set dimensions if IMCE provided non-zero values.
  if (file.width) {
    img.setAttribute('width', file.width);
  }
  if (file.height) {
    img.setAttribute('height', file.height);
  }
  img.setAttribute('alt', '');
  editor.insertContent(img.outerHTML);
  editor.windowManager.close();
}

/**
 * Icon definitions.
 */
imceTools.icons = {}
imceTools.icons.aligncenter = '<svg width="20" height="17" version="1.1" viewBox="0 0 20 17" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="5" width="10" height="7" stroke-linecap="round"/><path d="m0 16h20"/><path d="m0 1h20"/></g></svg>';
imceTools.icons.floatleft = '<svg width="20" height="17" version="1.1" viewBox="0 0 20 17" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="1" width="9" height="10" stroke-linecap="round"/><g><path d="m13 11h7"/><path d="m0 16h20"/><path d="m13 1h7"/><path d="m13 6h7"/></g></g></svg>';
imceTools.icons.floatnone = '<svg width="20" height="17" version="1.1" viewBox="0 0 20 17" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="2"><path d="m1 1h9v10h-9z" stroke-linecap="square"/><path d="m13 11h7"/><path d="m0 16h20"/></g></svg>';
imceTools.icons.floatright = '<svg width="20" height="17" version="1.1" viewBox="0 0 20 17" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="10" y="1" width="9" height="10" stroke-linecap="round"/><g><path d="m7 11h-7"/><path d="m0 16h20"/><path d="m7 1h-7"/><path d="m7 6h-7"/></g></g></svg>';
imceTools.icons.lowvision = '<svg width="20" height="16" version="1.1" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg"><path d="m2.6923 0-1.0694 1.0509 2.7376 2.6902a10.001 4.9218 0 0 0-4.3604 4.0624 10.001 4.9218 0 0 0 9.999 4.9217 10.001 4.9218 0 0 0 3.2339-0.26322l3.6002 3.5379 1.0694-1.0509-2.9266-2.876a10.001 4.9218 0 0 0 5.0241-4.2695 10.001 4.9218 0 0 0-10.001-4.9217 10.001 4.9218 0 0 0-0.092568 0 10.001 4.9218 0 0 0-3.87 0.4045zm10.395 4.2908a8.8211 3.7511 0 0 1 5.7331 3.5128 8.8211 3.7511 0 0 1-4.6677 3.3095 5.0279 4.8391 31.428 0 0-0.57312-6.3965 5.0279 4.8391 31.428 0 0-0.068932-0.067739 5.0279 4.8391 31.428 0 0-0.42344-0.35805zm-7.8149 0.34644 6.9188 6.801a8.8211 3.7511 0 0 1-2.192 0.11612 8.8211 3.7511 0 0 1-8.8193-3.7508 8.8211 3.7511 0 0 1 4.0926-3.1663zm4.7642 0.085157a3.4546 3.3949 0 0 1 2.4618 0.92899 3.4546 3.3949 0 0 1 0.06499 0.063868 3.4546 3.3949 0 0 1 0.37814 4.3566l-1.0615-1.0412a1.9938 1.9593 0 0 0-0.35057-2.2993 1.9938 1.9593 0 0 0-0.02167-0.023224 1.9938 1.9593 0 0 0-2.32-0.32321l-1.0596-1.0412a3.4546 3.3949 0 0 1 1.9084-0.62127z"/></svg>';
