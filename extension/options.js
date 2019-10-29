const badge = document.getElementById("badge");
const notification = document.getElementById("notification");
const max = document.getElementById("max");
const theme = document.getElementById("theme");
const ignore_no_changelogs = document.getElementById("ignore_no_changelogs");

async function load() {
    const res = await browser.storage.local.get("options");
    if (res.options.theme === "dark") {
        document.documentElement.dataset.theme = "dark";
    }
    badge.value = res.options.badge;
    notification.value = res.options.notification;
    max.value = res.options.max;
    theme.value = res.options.theme;
    ignore_no_changelogs.value = res.options.ignore_no_changelogs;
}

async function save() {
    await browser.storage.local.set({
        options: {
            badge: JSON.parse(badge.value),
            notification: JSON.parse(notification.value),
            max: parseInt(max.value),
            theme: theme.value,
            ignore_no_changelogs: JSON.parse(ignore_no_changelogs.value)
        }
    });
    document.documentElement.dataset.theme = theme.value;
}

document.addEventListener("DOMContentLoaded", load);
document.addEventListener("change", save);
