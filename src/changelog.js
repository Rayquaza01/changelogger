const push = document.getElementById("push");
const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

async function main() {
    browser.browserAction.setBadgeText({ text: "" });
    const resLocal = await browser.storage.local.get();
    setColorScheme(colorScheme);
    if (resLocal.changelogs.length === 0) {
        // message if no changelogs are saved yet
        push.innerText =
            "There are no saved changelogs yet. Changelogs will be added here when extensions are installed or updated.";
    }
    let frag = document.createDocumentFragment();
    for (let item of resLocal.changelogs) {
        let container = document.createElement("div");
        container.className = "item";
        frag.append(container);
        let name = document.createElement("span");
        name.className = "name";
        container.append(name);
        let icon = document.createElement("img");
        icon.src = item.icon;
        name.append(icon);
        let link = document.createElement("a");
        link.href = item.url;
        link.className = "link";
        link.innerText = item.name;
        name.append(link);
        let version = document.createElement("span");
        version.className = "version";
        version.innerText = `- ${item.version}`;
        name.append(version);
        let changelog = document.createElement("blockquote");
        changelog.className = "changelog";
        // use dom parser to remove redirects from links
        let dom = new DOMParser().parseFromString(item.release_notes, "text/html");
        let links = [...dom.querySelectorAll("a")];
        links.map(link => {
            let raw = decodeURIComponent(link.href);
            if (raw.startsWith("https://outgoing.prod.mozaws.net")) {
                link.href = raw.match(
                    /https?:\/\/outgoing\.prod\.mozaws\.net\/.*\/(https?:\/\/.*)/
                )[1];
            }
            return link;
        });
        while (dom.body.firstChild) {
            let child = dom.body.removeChild(dom.body.firstChild);
            changelog.appendChild(child);
        }
        container.appendChild(changelog);
    }
    push.appendChild(frag);
}

function setColorScheme(e) {
    e.matches ? document.documentElement.dataset.theme = "dark"
    : document.documentElement.dataset.theme = "light";
}

document.addEventListener("DOMContentLoaded", main);
colorScheme.addEventListener("change", setColorScheme);