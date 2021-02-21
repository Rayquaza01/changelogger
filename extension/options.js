const badge = document.getElementById("badge");
const notification = document.getElementById("notification");
const max = document.getElementById("max");
const ignore_no_changelogs = document.getElementById("ignore_no_changelogs");
const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

async function load() {
    const res = await browser.storage.sync.get("options");
    badge.value = res.options.badge;
    notification.value = res.options.notification;
    max.value = res.options.max;
    ignore_no_changelogs.value = res.options.ignore_no_changelogs;
}

async function save() {
    await browser.storage.sync.set({
        options: {
            badge: JSON.parse(badge.value),
            notification: JSON.parse(notification.value),
            max: parseInt(max.value),
            ignore_no_changelogs: JSON.parse(ignore_no_changelogs.value)
        }
    });
}

function setColorScheme(e) {
    e.matches ? document.documentElement.dataset.theme = "dark"
    : document.documentElement.dataset.theme = "light";
}

setColorScheme(colorScheme);

document.addEventListener("DOMContentLoaded", load);
document.addEventListener("change", save);
colorScheme.addEventListener("change", setColorScheme);
