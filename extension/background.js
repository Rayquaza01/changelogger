const hasProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const baseUrl = "https://addons.mozilla.org/api/v3/addons/addon";

function defaultValues(object, settings) {
    for (let key in settings) {
        if (!hasProperty(object, key)) {
            object[key] = settings[key];
        }
    }
    return object;
}

async function setup(info) {
    let resLocal = await browser.storage.local.get();
    let resSync = await browser.storage.sync.get();
    let defaults = await (await fetch("defaults.json")).json();
    res = defaultValues({...resSync, ...resLocal}, defaults);
    res.options = defaultValues(res.options, defaults.options);
    browser.storage.local.set(res.changelogs);
    browser.storage.sync.set(res.options);

    if (info.reason === "install" || info.reason === "update") {
        let manifest = browser.runtime.getManifest();
        await getInfo({
            name: manifest.name,
            id: "changelogger@r01",
            version: manifest.version
        });
    }
}

async function getChangelog(extension, details) {
    let requestURL = [baseUrl, extension.id, "versions", details.current_version.id].join(
        "/"
    );
    let versionDetail = await fetch(requestURL);
    let versionDetails = JSON.parse(await versionDetail.text());
    let resSync = await browser.storage.sync.get();
    let resLocal = await browser.storage.local.get();
    // message if no release notes
    if (versionDetails.release_notes === null) {
        if (resSyncSync.options.ignore_no_changelogs) {
            return;
        } else {
            versionDetails.release_notes = {};
            versionDetails.release_notes[details.default_locale] =
                "No changelog found for this version.";
        }
    }
    // return release notes based on browser locale (if available) or extension default_locale
    const ui_lang = browser.i18n.getUILanguage();
    let releaseNotes = hasProperty(versionDetails.release_notes, ui_lang)
        ? versionDetails.release_notes[ui_lang]
        : versionDetails.release_notes[details.default_locale];
    let item = {
        version: extension.version,
        icon: details.icon_url.split("?")[0],
        name: extension.name,
        release_notes: releaseNotes,
        url: details.url
    };
    // stringify objs to allow for comparison
    let stringified_list = resLocal.changelogs.map(JSON.stringify);
    let stringified_item = JSON.stringify(item);
    if (stringified_list.indexOf(stringified_item) !== -1) {
        // if changelog appears more than once, remove it
        resLocal.changelogs = stringified_list
            .filter(item => item !== stringified_item)
            .map(JSON.parse);
    }
    resLocal.changelogs.unshift(item);
    if (resSync.options.notification) {
        browser.notifications.create({
            type: "basic",
            title: `${extension.name} updated to version ${extension.version}`,
            message: resLocal.changelogs[0].release_notes,
            iconUrl: resLocal.changelogs[0].icon
        });
    }
    if (resSync.options.badge) {
        browser.browserAction.setBadgeText({ text: "!" });
    }
    while (resLocal.changelogs.length > resSync.options.max) {
        resLocal.changelogs.pop();
    }
    browser.storage.local.set(resLocal);
}

async function getInfo(extension) {
    let requestURL = [baseUrl, extension.id].join("/");
    let detail = await fetch(requestURL);
    let details = JSON.parse(await detail.text());
    if (extension.version === details.current_version.version) {
        getChangelog(extension, details);
    }
}

browser.management.onInstalled.addListener(getInfo);
browser.runtime.onInstalled.addListener(setup);
