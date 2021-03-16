require("./options.css");
import { browser } from "webextension-polyfill-ts";
import { setColorScheme } from "../../colorscheme/setColorScheme";

const badge = document.getElementById("badge") as HTMLSelectElement;
const notification = document.getElementById("notification") as HTMLSelectElement;
const max = document.getElementById("max") as HTMLInputElement;
const ignore_no_changelogs = document.getElementById("ignore_no_changelogs") as HTMLSelectElement;
const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");

/**
 * Load the options from storage into the DOM
 */
async function load(): Promise<void> {
    const res = await browser.storage.sync.get("options");
    badge.value = res.options.badge;
    notification.value = res.options.notification;
    max.value = res.options.max;
    ignore_no_changelogs.value = res.options.ignore_no_changelogs;
}

/**
 * Save the options from the DOM into storage
 */
function save(): void {
    browser.storage.sync.set({
        options: {
            badge: JSON.parse(badge.value),
            notification: JSON.parse(notification.value),
            max: parseInt(max.value),
            ignore_no_changelogs: JSON.parse(ignore_no_changelogs.value)
        }
    });
}

setColorScheme(colorScheme);

document.addEventListener("DOMContentLoaded", load);
document.addEventListener("change", save);
colorScheme.addEventListener("change", setColorScheme);
