const baseUrl = "https://addons.mozilla.org/api/v3/addons/addon"

async function setup() {
    var res = await browser.storage.local.get();
    if (res.options === undefined) {
        res.options = {};
    }
    if (res.options.badge === undefined) {
        res.options.badge = true;
    }
    if (res.options.notification === undefined) {
        res.options.notification = false;
    }
    if (res.options.max === undefined) {
        res.options.max = 10;
    }
    if (res.changelogs === undefined) {
        res.changelogs = [];
    }
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
