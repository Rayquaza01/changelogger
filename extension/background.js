const baseUrl = "https://addons.mozilla.org/api/v3/addons/addon"

async function setup() {
    let res = await browser.storage.local.get();
    res.options = res.hasOwnProperty("options") ? res.options : {};
    res.options.badge = res.options.hasOwnProperty("badge") ? res.options.badge : true;
    res.options.notification = res.options.hasOwnProperty("notification") ? res.options.notification : false;
    res.options.max = res.options.hasOwnProperty("max") ? res.options.max : 10;
    res.options.ignore_no_changelogs = res.options.hasOwnProperty("ignore_no_changelogs") ? res.options.ignore_no_changelogs : false;
    res.changelogs = res.hasOwnProperty("changelogs") ? res.changelogs : [];
    browser.storage.local.set(res);
}

async function getChangelog(extension, details) {
    let requestURL = [baseUrl, extension.id, "versions", details.current_version.id].join("/");
    let versionDetail = await fetch(requestURL);
    let versionDetails = JSON.parse(await versionDetail.text());
    let res = await browser.storage.local.get();
    // message if no release notes
    if (versionDetails.release_notes === null) {
        if (res.options.ignore_no_changelogs) {
            return
        } else {
            versionDetails.release_notes = {};
            versionDetails.release_notes[details.default_locale] = "No changelog found for this version.";
        }
    }
    // return release notes based on browser locale (if available) or extension default_locale
    const ui_lang = browser.i18n.getUILanguage();
    let releaseNotes = versionDetails.release_notes.hasOwnProperty(ui_lang) ?
        versionDetails.release_notes[ui_lang] :
        versionDetails.release_notes[details.default_locale];
    let item = {
        version: extension.version,
        icon: details.icon_url.split("?")[0],
        name: extension.name,
        release_notes: releaseNotes,
        url: details.url
    };
    // stringify objs to allow for comparison
    let stringified_list = res.changelogs.map(JSON.stringify);
    let stringified_item = JSON.stringify(item);
    if (stringified_list.indexOf(stringified_item) !== -1) {
        // if changelog appears more than once, remove it
        stringified_list = stringified_list.filter(item => item !== stringified_item);
        res.changelogs = stringified_list.map(JSON.parse);
    }
    res.changelogs.unshift(item);
    if (res.options.notification) {
        browser.notifications.create({
            type: "basic",
            title: `${extension.name} updated to version ${extension.version}`,
            message: res.changelogs[0].release_notes,
            iconUrl: res.changelogs[0].icon
        });
    }
    if (res.options.badge) {
        browser.browserAction.setBadgeText({text: "!"});
    }
    while (res.changelogs.length > res.options.max) {
        res.changelogs.pop();
    }
    browser.storage.local.set(res);
}

async function getInfo(extension) {
    let requestURL = [baseUrl, extension.id].join("/");
    let detail = await fetch(requestURL);
    let details = JSON.parse(await detail.text());
    if (extension.version === details.current_version.version) {
        getChangelog(extension, details)
    }
}

browser.management.onInstalled.addListener(getInfo);
browser.runtime.onInstalled.addListener(setup)
