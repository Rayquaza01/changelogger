# changelogger
A Firefox extension that gets changelogs for other Firefox extensions.

[![](https://img.shields.io/github/v/release/Rayquaza01/changelogger?label=github)](https://github.com/Rayquaza01/changelogger)
[![](https://img.shields.io/amo/v/changelogger)](https://addons.mozilla.org/en-US/firefox/addon/changelogger/)

## How to use:
 1. Install Changelogger.
 2. Wait for extensions to update or install new extensions.
 3. When an extension updates, Changelogger will fetch its changelog and place it in the popup.

## Options:
 * Badge (True or False) - Should the icon badge be shown when an extension is updated?
 * Notification (True or False) - whether to create a notification when an extension updates.
 * Max (number) - Max number of changelogs to store at once.
 * Ignore updates without changelogs (True or False) - Should updates with no changelogs be ignored?

The colorscheme will be automatically set (light or dark) based on your operating system's colorscheme setting.

## Permissions:
 * management - required to detect when any extension updates
 * storage - required to save changelogs
 * notifications - required to notify user when any extension updates
 * https://addons.mozilla.org/api/v4/addons/addon/\* - required to fetch changelog from addons.mozilla.org API

## What counts as an update?
Changelogger triggers when an extension is installed or updated. It then checks if the installed version is the latest version on addons.mozilla.org.
 * If it is, it tries to fetch the changelog from AMO.
 * If it isn't (or if it's a self distributed addon that's not available on AMO), it does not look for a changelog.
This way, you can manually install older or development versions of extensions without triggering Changelogger.

Changelogger looks for changelogs in your browser's locale, and falls back to the default locale for the extension.

## "No Changelog found for this version"
Updates will be logged by Changelogger even if there was no changelog included with the update. You can change this by enabling "Ignore Updates Without Changelogs" in the options.

## Acknowledgements:
 * Icons from [Material Design Icons](https://materialdesignicons.com/) ([OFL 1.1](http://scripts.sil.org/OFL))
 * Uses Mozilla's [Addons Server API](https://addons-server.readthedocs.io/en/latest/topics/api/v4_frozen/addons.html)
