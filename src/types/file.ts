import type { LiteUser } from "./user";

/**
 * A raw Misskey folder.
 */
export type MisskeyFolder = {
    /**
     * The ID of the folder, as assigned by the homserver.
     */
    id: string;
    /**
     * The date the folder was created.
     */
    createdAt: string;
    /**
     * The user-assigned name of the folder.
     */
    name: string;
    /**
     * The ID of the parent folder.
     */
    parentId: string;
    /**
     * The count of folders within the current folder.
     */
    foldersCount?: number;
    /**
     * The count of files within the current folder.
     */
    filesCount?: number;
    /**
     * The parent folder, if applicable.
     */
    parent?: MisskeyFolder | null;
};

/**
 * A raw Misskey file.
 */
export type MisskeyFile = {
    /**
     * The ID of the file, created by the Homeserver.
     */
    id: string;
    /**
     * The Date-Time string of when the file was created, or first observed by the home-server (generally when an accompanying post)
     */
    createdAt: string;
    /**
     * The name of the file as provided by the user.
     */
    name: string;
    /**
     * The type of the file, reported as a HTML Content-type.
     */
    type: string;
    /**
     * The MD5 Hash of the file, as reported by the Home Server.
     */
    md5: string;
    /**
     * The size of the file, measured in BITS (Not bytes!)
     */
    size: number;
    /**
     * If the file has been marked as sensitive (by the user, or by an administrator)
     */
    isSensitive: boolean;
    /**
     * The hash created to create a low-res blur of the image.
     */
    blurhash: string | null;
    /**
     * The properties of an image-like file.
     */
    properties: {
        /**
         * The width of the image.
         */
        width?: number;
        /**
         * The height of the image.
         */
        height?: number;
        /**
         * The orientation, as determined by the homeserver.
         */
        orientation?: number;
        /**
         * The average color of the photo.
         */
        avgColor?: string;
    };
    /**
     * The publicly accessible URL of the file.
     */
    url: string;
    /**
     * if the file is image-like, a publicly available URL to a low-res version of the image that the homeserver generated.
     */
    thumbnailUrl: string | null;
    /**
     * The alt-text, as created by the user.
     */
    comment: string | null;
    /**
     * The id of the folder that the item is from.
     */
    folderId: string | null;
    /**
     * The folder that the item is from.
     */
    folder: MisskeyFolder;
    /**
     * The user the item belongs to.
     */
    user: LiteUser | null;
};
