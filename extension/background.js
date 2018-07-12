const baseUrl = "https://addons.mozilla.org/api/v3/addons/addon"

async function setup() {
    var res = await browser.storage.local.get();
    res.options = res.hasOwnProperty("options") ? res.options : {};
    res.options.badge = res.options.hasOwnProperty("badge") ? res.options.badge : true;
    res.options.notification = res.options.hasOwnProperty("notification") ? res.options.notification : false;
    res.options.max = res.options.hasOwnProperty("max") ? res.options.max : 10;
    res.changelogs = res.hasOwnProperty("changelogs") ? res.changelogs : [];
    browser.storage.local.set(res);
}

async function getChangelog(extension, details) {
    var requestURL = [baseUrl, extension.id, "versions", details.current_version.id].join("/");
    var versionDetail = await fetch(requestURL);
    var versionDetails = JSON.parse(await versionDetail.text());
    var res = await browser.storage.local.get();
    var releaseNotes = versionDetails.release_notes[details.default_locale];
    res.changelogs.unshift({
        version: extension.version,
        icon: details.icon_url.split("?")[0],
        name: extension.name,
        release_notes: releaseNotes,
        url: details.url
    });
    if (res.options.notification) {
        var title = [extension.name, "updated to version", extension.version].join(" ");
        var text = res.changelogs[0].release_notes;
        browser.notifications.create({
            type: "basic",
            title: title,
            message: text,
            iconUrl: res.changelogs[0].icon
        });
    }
    if (res.options.badge) {
        browser.browserAction.setBadgeText({text: "!"});
    }
    if (res.changelogs.length > res.options.max) {
        res.changelogs.pop();
    }
    browser.storage.local.set(res);
}

async function getInfo(extension) {
    var requestURL = [baseUrl, extension.id].join("/");
    var detail = await fetch(requestURL);
    var details = JSON.parse(await detail.text());
    if (extension.version === details.current_version.version) {
        getChangelog(extension, details)
    }
}

browser.management.onInstalled.addListener(getInfo);
browser.runtime.onInstalled.addListener(setup)
