% Changelogger Help

## Options

> ### Badge
> > True or false. Whether to display the badge on the toolbar icon. Default true.

> ### Notification
> > True or false. Whether to display notifications when extensions update. Default false.

> ### Max
> > Number. The maximum number of changelogs to save at one time. Must be at least 1. Default 10.

> ### Theme
> > Light or Dark. The theme to use for the popup. Default light.

> ### Ignore Updates Without Changelogs
> > True or false. Whether to ignore extension updates without changelogs. Default false.


## What counts as an update?
> Changelogger triggers when an extension is installed or updated. It then checks if the installed version is the latest version on addons.mozilla.org.

> * If it is, it tries to fetch the changelog from AMO.
> * If it isn't (or if it's a self distributed addon that's not available on AMO), it does not look for a changelog.

> This way, you can manually install older or development versions of extensions without triggering Changelogger.  
> Changelogger looks for changelogs in (1) the browser's locale and (2) the extension's locale.

## "No changelog found for this version"
> Updates will be logged by Changelogger even if there was no changelog included with the update. You can change this by enabling "Ignore Updates Without Changelogs" in the options.

## Links
 * [AMO API](https://addons-server.readthedocs.io/en/latest/topics/api/addons.html)
 * [Github Repository](https://github.com/Rayquaza01/Changelogger)
