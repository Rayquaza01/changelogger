# changelogger
A Firefox extension that gets changelogs for other Firefox extensions.

How to use:
 1. Install Changelogger.
 2. Wait for extensions to update or install new extensions.
 3. When an extension updates, Changelogger will fetch its changelog and place it in the popup.

Options:
 * Badge (True or False) - whether to display a badge on the toolbar icon when an extension updates.
 * Notification (True or False) - whether to create a notification when an extension updates.
 * Max (number) - How many changelogs to save at a time
 * Theme (Light or Dark) - whether to use a light or dark theme
 * Ignore updates without changelogs - whether to ignore updates that don't have changelogs

Permissions:
 * management - required to detect when any extension updates
 * storage - required to save changelogs
 * notifications - required to notify user when any extension updates
 * https://addons.mozilla.org/api/v3/addons/addon/\* - required to fetch changelog from addons.mozilla.org API
 * webRequest - required to make web request to AMO API

Adknowledgements:
 * Icons from [Material Design Icons](https://materialdesignicons.com/) ([OFL 1.1](http://scripts.sil.org/OFL))
 * Uses Mozilla's [Addons Server API](https://addons-server.readthedocs.io/en/2018.05.17/topics/api/addons.html)
