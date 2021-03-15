import { AddonDetails } from "./AddonResponse";
import { browser } from "webextension-polyfill-ts";

export async function getDetails(id: string): Promise<AddonDetails> {
    const requestURL = new URL("https://https://addons.mozilla.org/api/v4/addons/addon");
    requestURL.pathname += "/" + id;
    requestURL.searchParams.append("lang", browser.i18n.getUILanguage());

    return await (await fetch(requestURL.href)).json();
}
