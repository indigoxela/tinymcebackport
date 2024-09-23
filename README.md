# TinyMCE backport

Integrates the most recent and supported [TinyMCE](https://www.tiny.cloud/)
 as alternative WYSIWYG editor for Drupal 7.

It's a standalone module, unrelated to the existing, for a short while revived
 TinyMCE module, and also unrelated to the Wysiwyg module.

The TinyMCE JavaScript library *ships with this module*, no need for extra
downloads nor the libraries module.

Note that there's absolutely *no admin interface*. All adaptions have to be
done via API in code in a custom module.

![Screenshot of a node form with the editor](https://raw.githubusercontent.com/indigoxela/tinymcebackport/7.x-1.x/screenshot-tinymce-drupal7.png)

## Solving the Drupal 7 rich text editor dilemma

Since the CKEditor 4 module has been deprecated in Drupal, the only way to get
an up to date editor with Drupal 7 would be CKEditor 4 LTS - which has a
commercial license model with obscur pricing. Hardly appropriate for any site.

Support for CKEditor 5 never landed in Drupal 7, and probably never will.
And all editors supported by the Wysiwyg module are hopelessly outdated.

This Drupal 7 module aims to close that gap. It also provides IMCE integration
for file and image picking, and some rudimentary Media module support.

## Installation

- Install this module using the
  [latest tar.gz release](https://github.com/indigoxela/tinymcebackport/releases/latest)
  (or download a dev snapshot for testing)
- Disable CKEditor 4 on profiles for text formats on admin/config/content/ckeditor

If *filtered_html* is the text format you need the editor for, this module
should already do its job at that point.

If [IMCE](https://www.drupal.org/project/imce) is installed, the image plugin
will use that for picking inline images, the link plugin for picking file links.
A small "browse" button will appear in the dialogs.
Note that IMCE is no dependency.

If IMCE isn't installed, but the [Media module](https://www.drupal.org/project/media)
is, there's some integration with that to pick files.

Provides a plugin for image alignment based on CSS classes.

## Updating

Unfortunately, there's no automatic way to inform you about available
updates for this module via Drupal. Neither can you update it via Drupal admin UI.

You have to download the [tar.gz](https://github.com/indigoxela/tinymcebackport/releases/latest),
unpack, and upload via FTP (unless you have SSH access to your webspace).

GitHub can notify you about updates, if you subscribe to this repository. But
that requires a GitHub account.
One possible alternative is the repository RSS feed
`https://github.com/indigoxela/tinymcebackport/tags.atom`, but that's not very
convenient, either.

## Maintenance

This module will receive updates as necessary, for example to keep the TinyMCE
library up to date, but there won't be any addtional features. Notably no
admin interface will get added.

So if you need something totally different, just fork it. ;-)

## Customize via API

Very likely you'll have to implement
`hook_tinymcebackport_enabled_formats_alter()` to change the filter formats,
the editor's attached to. Unless you only need the editor for the
filtered_html format, which is the default.

If you want to change toolbar buttons or enable/disable plugins, you'll have to
implement `hook_tinymcebackport_options_alter()`.

The file tinymcebackport.api.php contains examples for both hooks.

There's also an example module in
[this issue comment](https://github.com/indigoxela/tinymcebackport/issues/3#issuecomment-2060572289).

## Credits

Bundles the versatile [TinyMCE](https://www.tiny.cloud/) JavaScript library,
maintained with <3 by Ephox Corporation DBA Tiny Technologies, Inc. Licensed
under the terms of GNU General Public License Version 2 or later beginning with
its version 7.0 (used to be MIT with version 6).

The editor has been around for two decades and is one of the most used
Open Source JavaScript based WYSIWYG editors, integrated in many projects.

Based on work done for the
[Backdrop CMS TinyMCE integration module](https://backdropcms.org/project/tinymce)

## License

This project is GPL v2 software. See the LICENSE.txt file in this directory for complete text.
