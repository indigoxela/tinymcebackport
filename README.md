# TinyMCE backport

Integrates the most recent [TinyMCE](https://www.tiny.cloud/) as alternative
 WYSIWYG editor for Drupal 7.

Fun fact: this is a backport from Backdrop CMS, not from Drupal 10.

## Installation

The library (TinyMCE 6.8.x) ships with this module, no need for external
code.

- Install this module using the zipfile
- Disable CKEditor 4 on profiles for text formats on admin/config/content/ckeditor

If filtered_html is the text format you need an editor for, this module
should already do its job from that point.
If IMCE is installed, the image plugin will use that for picking inline
images. But IMCE is no dependency.

Note that there's absolutely no admin interface. All adaptions have to be
done via API in code. See tinymcebackport.api.php for some basic examples.

## Maintenance

Currently this is more like a proof of concept module. Fully functional, but
sparse (no) admin UI. Taking over maintainership is possible and encouraged.

## Credits

Bundles the versatile [TinyMCE](https://www.tiny.cloud/) JavaScript library
(MIT licensed), maintained with <3 by Tiny Technologies Inc. The editor has
been around for almost two decades and is one of the most used Open Source
JavaScript based WYSIWYG editors, integrated in many projects.

## License

This project is GPL v2 software. See the LICENSE.txt file in this directory for complete text.
