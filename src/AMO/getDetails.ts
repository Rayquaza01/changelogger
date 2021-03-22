import { AddonDetails } from "./AddonResponse";
import { browser } from "webextension-polyfill-ts";

/**
 * Get details about an addon from AMO.
 * @param id The ID of the extension. `null` will be returned if this is not a valid ID.
 */
export async function getDetails(id?: string): Promise<AddonDetails | null> {
    if (id === undefined) {
        return null;
    }

    const requestURL = new URL("https://addons.mozilla.org/api/v4/addons/addon");
    requestURL.pathname += "/" + id;
    requestURL.searchParams.append("lang", browser.i18n.getUILanguage());

    const res = await fetch(requestURL.href);
    if (res.status >= 200 && res.status <= 299) {
        return await res.json();
    } else {
        return null;
    }
}
