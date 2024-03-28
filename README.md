# TinyMCE backport

Integrates the most recent and supported [TinyMCE](https://www.tiny.cloud/)
 as alternative WYSIWYG editor for Drupal 7.

It's a standalone module, unrelated to the existing, for a short while revived
 TinyMCE module, and also unrelated to the Wysiwyg module.

The TinyMCE JavaScript library ships with this module, no need for extra
downloads nor the libraries module.

Note that there's absolutely *no admin interface*. All adaptions have to be
done via API in code in a custom module.

## Installation

- Install this module using the
  [latest tar.gz release](https://github.com/indigoxela/tinymcebackport/releases/latest)
  (or download a dev snapshot for testing)
- Disable CKEditor 4 on profiles for text formats on admin/config/content/ckeditor

If *filtered_html* is the text format you need the editor for, this module
should already do its job at that point.

If IMCE is installed, the image plugin will use that for picking inline
images, the link plugin for picking file links. A small "browse" button will
appear in the dialogs.
Note that IMCE is no dependency.

Provides a plugin for image alignment based on CSS classes.

## Maintenance

This module will receive updates as necessary, for example to update the
TinyMCE library, but there won't be any addtional features. Notably no
admin interface will get added.

So if you need something totally different, just fork it. ;-)

## Customize via API

Very likely you'll have to implement
hook_tinymcebackport_enabled_formats_alter() to change the filter formats,
the editor's attached to. Unless you only need the editor for the
filtered_html format, which is the default.

If you want to change toolbar buttons or enable/disable plugins, you'll have to
implement hook_tinymcebackport_options_alter().

The file tinymcebackport.api.php contains examples for both hooks.

## Credits

Bundles the versatile [TinyMCE](https://www.tiny.cloud/) JavaScript library,
maintained with <3 by Ephox Corporation DBA Tiny Technologies, Inc. Licensed
under the terms of GNU General Public License Version 2 or later beginning with
its version 7.0 (used to be MIT with version 6).

The editor has been around for almost two decades and is one of the most used
Open Source JavaScript based WYSIWYG editors, integrated in many projects.

Based on work done for the
[Backdrop CMS TinyMCE integration module](https://backdropcms.org/project/tinymce)

## License

This project is GPL v2 software. See the LICENSE.txt file in this directory for complete text.
