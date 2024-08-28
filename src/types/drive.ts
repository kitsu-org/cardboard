/**
 * Options to sort the Folders or files.
 */
export type ShowOptions = {
    /**
     * The amount of items you'd like to have returned. limit [1..100].
     */
    limit?: number;
    /**
     * Get items that are NEWER than the itemID you are listing.
     */
    sinceId?: string;
    /**
     * Get items that are OLDER than the itemID you are listing.
     */
    untilId?: string;
    /**
     * Look for the item within the folderId.
     */
    folderId?: string;
    /**
     * The type of the file.
     */
    type?: string;
    /**
     * Sorting options.
     */
    sort?:
        | "+createdAt"
        | "-createdAt"
        | "+name"
        | "-name"
        | "+size"
        | "-size"
        | null;
};

/**
 * the options of the file.
 */
export type FileOptions = {
    /**
     * The ID of the folder you'd like to place the file into.
     */
    folderId?: string | null;
    /**
     * The name of the file. if null, will be named by a Date-Time string by the homeserver (citation needed)
     */
    name?: string | null;
    /**
     * whether or not the file should be blurred.
     */
    isSensitive?: boolean;
    /**
     * Whether or not to force the file to be inserted, potentially damaging existing files.
     */
    force?: boolean;
};
