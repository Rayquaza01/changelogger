const badge = document.getElementById("badge");
const notification = document.getElementById("notification");
const max = document.getElementById("max");

async function load() {
    var res = await browser.storage.local.get("options");
    badge.value = res.options.badge;
    notification.value = res.options.notification;
    max.value = res.options.max;
}

async function save() {
    browser.storage.local.set({
        options: {
            badge: JSON.parse(badge.value),
            notification: JSON.parse(notification.value),
            max: parseInt(max.value)
        }
    })
}

document.addEventListener("DOMContentLoaded", load)
document.addEventListener("change", save)
