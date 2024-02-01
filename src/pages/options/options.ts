require("./options.css");
import browser from "webextension-polyfill";
import { Options, OptionsInterface, FormElements } from "../../OptionsInterface";

const form = document.querySelector("form") as HTMLFormElement;
const formElements = form.elements as FormElements;

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
    const opts = new Options((await browser.storage.sync.get()).options);
    formElements.badge.checked = opts.badge;
    formElements.notification.checked = opts.notification;
    formElements.max.value = opts.max.toString();
    formElements.ignore_no_changelogs.checked = opts.ignore_no_changelogs;
}

/**
 * Save the options from the DOM into storage
 */
function save(): void {
    if (form.checkValidity()) {
        const options: OptionsInterface = {
            badge: formElements.badge.checked,
            notification: formElements.notification.checked,
            max: parseInt(formElements.max.value),
            ignore_no_changelogs: formElements.ignore_no_changelogs.checked
        };

        browser.storage.sync.set({ options });
    }
}

document.addEventListener("DOMContentLoaded", load);
document.addEventListener("change", save);
clearChangelogsButton.addEventListener("click", clearChangelogs);
