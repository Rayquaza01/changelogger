require("./changelog.css");
import { browser } from "webextension-polyfill-ts";
import { setColorScheme } from "../../colorscheme/setColorScheme";
import { Changelog } from "../../ChangelogInterface";

const settings = document.getElementById("settings") as HTMLDivElement;
const push = document.getElementById("push") as HTMLDivElement;
const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");

/**
 * Place saved changelogs into the page
 */
async function main(): Promise<void> {
    browser.browserAction.setBadgeText({ text: "" });
    const resLocal = await browser.storage.local.get();
    setColorScheme(colorScheme);

    let changelogs: Changelog[] = [];

    if (Array.isArray(resLocal.changelogs)) {
        changelogs = resLocal.changelogs;
    }

    if (changelogs.length === 0) {
        changelogs.push({
            id: "none",
            version: "0.0.0",
            icon: browser.runtime.getURL("icons/icon-96.png"),
            name: browser.i18n.getMessage("noChangelogsYetTitle"),
            release_notes: browser.i18n.getMessage("noChangelogsYet"),
            url: "https://addons.mozilla.org"
        });
    }

    const frag = document.createDocumentFragment();

    for (const item of changelogs) {
        // container for changelog item
        const container = document.createElement("div");
        container.className = "item";
        frag.appendChild(container);

        // container for name, icon, version
        const name = document.createElement("span");
        name.className = "name";
        container.appendChild(name);

        // image
        const icon = document.createElement("img");
        icon.src = item.icon;
        name.appendChild(icon);

        // name and link to AMO
        const link = document.createElement("a");
        link.href = item.url;
        link.className = "link";
        link.innerText = item.name;
        name.appendChild(link);

        // version
        const version = document.createElement("span");
        version.className = "version";
        version.innerText = `- ${item.version}`;
        name.appendChild(version);

        // container for changelog
        const changelog = document.createElement("blockquote");
        changelog.className = "changelog";

        // use dom parser to remove redirects from links
        const dom = new DOMParser().parseFromString(item.release_notes, "text/html");

        // loop through each link element
        for (const link of [...dom.querySelectorAll("a")]) {
            const raw = decodeURIComponent(link.href);
            // remove redirect from link if its found
            if (raw.startsWith("https://outgoing.prod.mozaws.net")) {
                link.href = (raw.match(/https?:\/\/outgoing\.prod\.mozaws\.net\/.*\/(https?:\/\/.*)/) ?? [])[1];
            }
        }

        // Move each item from dom to actual document
        while (dom.body.firstChild) {
            const child = dom.body.removeChild(dom.body.firstChild);
            changelog.appendChild(child);
        }

        container.appendChild(changelog);
    }
    push.appendChild(frag);
}


document.addEventListener("DOMContentLoaded", main);
colorScheme.addEventListener("change", setColorScheme);
settings.addEventListener("click", () => browser.runtime.openOptionsPage());
