// based on https://addons-server.readthedocs.io/en/latest/topics/api/v4_frozen/addons.html

/**
 * Based on https://addons-server.readthedocs.io/en/latest/topics/api/v4_frozen/addons.html#detail
 *
 * Partial version of actual object structure, only includes what is used.
 */
export interface AddonDetails {
    /** Object holding the current version of the add-on. For performance reasons the license field omits the text property from both the search and detail endpoints. */
    current_version: VersionDetails;
    /** The URL to icon for the add-on (including a cachebusting query string). */
    icon_url: string;
    /** The (absolute) add-on detail URL. */
    url: string;
    /** The add-on name. */
    name: string;
}

/**
 * Based on https://addons-server.readthedocs.io/en/latest/topics/api/v4_frozen/addons.html#version-detail
 *
 * Partial version of actual object structure, only includes what is used.
 */
export interface VersionDetails {
    /** The version number string for the version. */
    version: string;
    /** The release notes for this version. */
    release_notes: string | null;
}
