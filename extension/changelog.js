const push = document.getElementById("push");

async function main() {
    browser.browserAction.setBadgeText({text: ""});
    var res = await browser.storage.local.get();
    if (res.changelogs.length === 0) {
        push.innerText = "There are no saved changelogs yet. Changelogs will be added here when extensions are installed or updated."
    }
    for (var item of res.changelogs) {
        var container = document.createElement("div");
        container.className = "item";
        push.append(container);
        var name = document.createElement("span");
        name.className = "name";
        container.append(name);
        var icon = document.createElement("img");
        icon.src = item.icon;
        name.append(icon);
        var link = document.createElement("a");
        link.href = item.url;
        link.className = "link";
        link.innerText = item.name;
        name.append(link);
        var version = document.createElement("span");
        version.className = "version";
        version.innerText = item.version;
        name.append(version);
        var changelog = document.createElement("blockquote");
        changelog.className = "changelog";
        var dom = new DOMParser().parseFromString(item.release_notes, "text/html");
        var links = dom.getElementsByTagName("a");
        for (var link of links) {
            var raw = decodeURIComponent(link.href);
            link.href = raw.match(/https?:\/\/outgoing\.prod\.mozaws\.net\/.*\/(https?:\/\/.*)/)[1];
        }
        var frag = document.createDocumentFragment();
        while (dom.body.firstChild) {
            var child = dom.body.removeChild(dom.body.firstChild);
            frag.append(child);
        }
        changelog.append(frag);
        container.append(changelog);
    }
}

document.addEventListener("DOMContentLoaded", main);
