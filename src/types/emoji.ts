/**
 * An Emoji.
 */
export type Emoji = {
    /**
     * The ID of the emoji, as reported by the homeserver.
     */
    id: string;
    /**
     * Aliases the homeserver may have for the emoji, if exists.
     */
    aliases: string[];
    /**
     * the name of the emoji.
     */
    name: string;
    /**
     * the category. if from remote server, this is null.
     */
    category: string | null;
    /**
     * the host of the emoji. this is null if from the homeserver.
     */
    host: string | null;
    /**
     * the publicly accessibly image associated with the emoji.
     */
    url: string;
    /**
     * the license of the emoji.
     */
    license: string | null;
    /**
     * whether or not the emoji is NSFW.
     */
    isSensitive: boolean;
    /**
     * whether or not the emoji can only be used on the homserver.
     */
    localOnly: boolean;
    /**
     * a list of roles that are permitted to use the emoji.
     */
    roleIdsThatCanBeUsedThisEmojiAsReaction: string[];
};
