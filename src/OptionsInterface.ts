export interface OptionsInterface {
    /** Should the icon badge be shown when an extension is updated? */
    badge: boolean;
    /** Should a notification be created when an extension is updated? */
    notification: boolean;
    /** Max number of changelogs to store at once. */
    max: number;
    /** Should updates with no changelogs be ignored? */
    ignore_no_changelogs: boolean;
}

export interface FormElements extends HTMLFormControlsCollection {
    badge: HTMLInputElement;
    notification: HTMLInputElement;
    max: HTMLInputElement;
    ignore_no_changelogs: HTMLInputElement;
}

export class Options implements OptionsInterface {
    badge = true;
    notification = true;
    max = 10;
    ignore_no_changelogs = false;

    constructor(opts?: Partial<OptionsInterface>) {
        opts ??= {};

        if (typeof opts.badge === "boolean") {
            this.badge = opts.badge;
        }

        if (typeof opts.notification === "boolean") {
            this.notification = opts.notification;
        }

        if (typeof opts.max === "number" && opts.max > 0) {
            this.max = opts.max;
        }

        if (typeof opts.ignore_no_changelogs === "boolean") {
            this.ignore_no_changelogs = opts.ignore_no_changelogs;
        }
    }
}
