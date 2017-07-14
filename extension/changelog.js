function main() {
    browser.browserAction.setBadgeText({
        text: ""
    });
    browser.storage.local.get().then((res) => {
        for (var item of res.changelogs) {
            var push = document.getElementById("push");
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
                console.log(raw);
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
    });
}
document.addEventListener("DOMContentLoaded", main);
