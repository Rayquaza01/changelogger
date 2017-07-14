const baseUrl = "https://addons.mozilla.org/api/v3/addons/addon"
function setup() {
    browser.storage.local.get().then((res) => {
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
    });
}
function getChangelog(extension, details) {
    var versionDetail = new XMLHttpRequest();
    var requestURL = [baseUrl, extension.id, "versions", details.current_version.id].join("/");
    versionDetail.open("GET", requestURL);
    versionDetail.addEventListener("load", () => {
        if (versionDetail.status === 200 && versionDetail.readyState === 4) {
            var versionDetails = JSON.parse(versionDetail.response);
            browser.storage.local.get().then((res) => {
                var releaseNotes = versionDetails.release_notes[details.default_locale];
                // Sanitize the html. Shouldn't be nessecary because it came straight from AMO, but just in case!
                var clean = sanitizeHtml(releaseNotes, {
                    allowedTags: ["a", "abbr", "acronym", "b", "blockquote", "code", "em", "i", "li", "ol", "strong", "ul"],
                    allowedAttributes: {
                        a: ["href", "title"],
                        abbr: ["title"],
                        acronym: ["title"]
                    }
                });
                res.changelogs.unshift({
                    version: extension.version,
                    icon: details.icon_url.split("?")[0],
                    name: extension.name,
                    release_notes: clean,
                    url: details.url
                });
                // if (res.options.notification) {
                if (true) {
                    var title = [extension.name, "updated to version", extension.version].join(" ");
                    var text = sanitizeHtml(res.changelogs[0].release_notes, {
                        allowedTags: [],
                        allowedAttributes: []
                    });
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
            });
        }
    });
    versionDetail.send(null);
}
function getInfo(extension) {
    var detail = new XMLHttpRequest();
    var requestURL = [baseUrl, extension.id].join("/");
    detail.open("GET", requestURL);
    detail.addEventListener("load", () => {
        if (detail.status === 200 && detail.readyState === 4) {
            var details = JSON.parse(detail.response);
            if (extension.version === details.current_version.version) {
                getChangelog(extension, details)
            }
        }
    });
    detail.send(null);
}
browser.management.onInstalled.addListener(getInfo);
browser.runtime.onInstalled.addListener(setup)
