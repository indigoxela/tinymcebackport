# TinyMCE backport

Integrates the most recent and supported [TinyMCE](https://www.tiny.cloud/)
 as alternative WYSIWYG editor for Drupal 7.

It's a standalone module, unrelated to the existing, for a short while revived
 TinyMCE module, and also unrelated to the Wysiwyg module.

The TinyMCE JavaScript library ships with this module, no need for extra
downloads nor the libraries module.

Note that there's absolutely *no admin interface*. All adaptions have to be
done via API in code in a custom module. See tinymcebackport.api.php for some
basic examples.

## Installation

- Install this module using the ZIP file
- Disable CKEditor 4 on profiles for text formats on admin/config/content/ckeditor

If *filtered_html* is the text format you need the editor for, this module
should already do its job at that point.

If IMCE is installed, the image plugin will use that for picking inline
images, the link plugin for picking file links. A small "browse" button will
appear in the dialogs.
Note that IMCE is no dependency.

Provides a plugin for image alignment based on CSS classes.

## Maintenance

Currently this is more like a proof of concept module. Fully functional, but
without any admin UI (the maintainer doesn't need any ;-) ).
Forking is possible – just go for it.

## Credits

Bundles the versatile [TinyMCE](https://www.tiny.cloud/) JavaScript library
(MIT licensed), maintained with <3 by Tiny Technologies Inc. The editor has
been around for almost two decades and is one of the most used Open Source
JavaScript based WYSIWYG editors, integrated in many projects.

Based on work done for the [Backdrop CMS](https://backdropcms.org/)
TinyMCE integration module.

## License

This project is GPL v2 software. See the LICENSE.txt file in this directory for complete text.
