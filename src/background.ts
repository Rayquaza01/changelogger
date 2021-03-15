import { Semaphore } from "./Semaphore";
import { browser, Management, Runtime } from "webextension-polyfill-ts";
import { getDetails } from "./AMO/getDetails";
import { Options } from "./OptionsInterface";
import { Changelog } from "./ChangelogInterface";

const STORAGE_SEMAPHORE = new Semaphore();

async function setup(info: Runtime.OnInstalledDetailsType) {
    const resLocal = await browser.storage.local.get();
    const resSync = await browser.storage.sync.get();
    if (Object.prototype.hasOwnProperty.call(resLocal, "options")) {
        resSync.options = resLocal.options;
        await browser.storage.local.remove("options");
    }

    const options = new Options(resSync.options);
    browser.storage.sync.set({ options });

    if (!Array.isArray(resLocal.changelogs)) {
        await browser.storage.local.set({ changelogs: [] });
    }

    if (info.reason === "install" || info.reason === "update") {
        const manifest = browser.runtime.getManifest();
        await getChangelog({
            name: manifest.name,
            id: "changelogger@r01",
            version: manifest.version
        });
    }
}

async function getChangelog(info: Partial<Management.ExtensionInfo>) {
    // if (info.installType === "development") {
    //     return;
    // }

    const details = await getDetails(info.id ?? "");
    const opts = new Options((await browser.storage.sync.get()).options);

    console.log(details.name);

    if (info.version === details.current_version.version) {
        let releaseNotes: string;
        if (details.current_version.release_notes === null) {
            if (opts.ignore_no_changelogs) {
                return;
            }

            releaseNotes = browser.i18n.getMessage("noChangelog");
        } else {
            releaseNotes = details.current_version.release_notes;
        }

        const item: Changelog = {
            id: info.id ?? "",
            version: details.current_version.version,
            icon: details.icon_url.split("?")[0],
            name: details.name,
            release_notes: releaseNotes,
            url: details.url
        };

        // Request access to critical region
        // Block until available
        await STORAGE_SEMAPHORE.getLock();

        const changelogs: Changelog[] = (await browser.storage.local.get())
            .changelogs
            .filter((clItem: Changelog) => clItem.id !== item.id || clItem.version !== item.version);
        changelogs.unshift(item);
        while (changelogs.length > opts.max) {
            changelogs.pop();
        }
        await browser.storage.local.set({ changelogs });

        // Release critical region
        // Changelog list in storage.local should not be updated after this point
        STORAGE_SEMAPHORE.releaseLock();

        if (opts.notification) {
            browser.notifications.create({
                type: "basic",
                title: browser.i18n.getMessage("updateTitle", [info.name, info.version]),
                message: item.release_notes,
                iconUrl: item.icon
            });
        }

        if (opts.badge) {
            browser.browserAction.setBadgeText({ text: "!" });
        }
    }
}

browser.management.onInstalled.addListener(getChangelog);
browser.runtime.onInstalled.addListener(setup);
