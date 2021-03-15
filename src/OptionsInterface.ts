export interface OptionsInterface {
    /** Should the icon badge be updated when an extension is updated? */
    badge: boolean;
    /** Should a notification be created when an extension is updated */
    notification: boolean;
    /** Max number of changelogs to store at once */
    max: number;
    /** Should updates with no changelogs be ignored? */
    ignore_no_changelogs: boolean;
}

export class Options implements OptionsInterface {
    badge: boolean;
    notification: boolean;
    max: number;
    ignore_no_changelogs: boolean;

    constructor(opts: Partial<OptionsInterface>) {
        opts = opts ?? {};
        this.badge = opts.badge ?? true;
        this.notification = opts.notification ?? true;
        this.max = opts.max ?? 10;
        this.ignore_no_changelogs = opts.ignore_no_changelogs ?? false;
    }
}
