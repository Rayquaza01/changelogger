require("./options.css");
import { browser } from "webextension-polyfill-ts";
import { Options, OptionsInterface } from "../../OptionsInterface";
import { setColorScheme } from "../../colorscheme/setColorScheme";

const badge = document.getElementById("badge") as HTMLSelectElement;
const notification = document.getElementById("notification") as HTMLSelectElement;
const max = document.getElementById("max") as HTMLInputElement;
const ignore_no_changelogs = document.getElementById("ignore_no_changelogs") as HTMLSelectElement;
const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");

const clearChangelogsButton = document.getElementById("clearChangelogsButton") as HTMLButtonElement;

/**
 * Clears the list of changelogs saved in storage
 */
function clearChangelogs() {
    browser.storage.local.set({ changelogs: [] });
}

/**
 * Load the options from storage into the DOM
 */
async function load(): Promise<void> {
    const opts = new Options((await browser.storage.local.get()).options);
    badge.value = opts.badge.toString();
    notification.value = opts.notification.toString();
    max.value = opts.max.toString();
    ignore_no_changelogs.value = opts.ignore_no_changelogs.toString();
}

/**
 * Save the options from the DOM into storage
 */
function save(): void {
    const options: OptionsInterface = {
        badge: JSON.parse(badge.value),
        notification: JSON.parse(notification.value),
        max: parseInt(max.value),
        ignore_no_changelogs: JSON.parse(ignore_no_changelogs.value)
    };
    browser.storage.local.set({ options });
}

setColorScheme(colorScheme);

document.addEventListener("DOMContentLoaded", load);
document.addEventListener("change", save);
colorScheme.addEventListener("change", setColorScheme);
clearChangelogsButton.addEventListener("click", clearChangelogs);
