import type { MisskeyFile } from "./file";
import type { MisskeyLiteUser } from "./user";

/**
 * Determines the way the note will handle being reacted to.
 */
export enum ReactionAcceptance {
    /**
     * No emotes are permitted as reactions.
     */
    LikeOnly = "likeOnly",
    /**
     * No emotes are permitted from remote servers.
     */
    LikeOnlyForRemote = "likeOnlyForRemote",
    /**
     * Only non-sensitive emotes can be used.
     */
    NonSensitiveOnly = "nonSensitiveOnly",
    /**
     * Only non-sensitive emotes can be used; and remote users can only "like" the post.
     */
    NonSensitiveOnlyForLocalLikeOnlyForRemote = "nonSensitiveOnlyForLocalLikeOnlyForRemote",
}

/**
 * Note options that can be set before the note is posted.
 */
export type NoteOptions = {
    /**
     * Who is able to see the message/
     */
    visibility?: NoteVisibility;
    /**
     * if the note is specified, who can see the message?
     */
    visibleUserIds?: string[];
    /**
     * the content warning that you'd like to use to hide the message, if applicable.
     */
    cw?: string;
    /**
     * Whether or not the post is allowed to federate.
     */
    localOnly?: boolean;
    /**
     * The way that the note is allowed to be interacted with.
     */
    reactionAcceptance?: ReactionAcceptance | null;
    /**
     * {unknown what this does. if you know, open a PR!}
     */
    noExtractMentions?: boolean;
    /**
     * {unknown what this does. if you know, open a PR!}
     */
    noExtractHashtags?: boolean;
    /**
     * {unknown what this does. if you know, open a PR!}
     */
    noExtractEmojis?: boolean;
    /**
     * The ID of the note you'd like to reply to.
     */
    replyId?: string | null;
    /**
     * The ID of the note you'd like to renote or quote.
     */
    renoteId?: string | null;
    /**
     * the ID of the channel you'd like to post to, if applicable.
     */
    channelId?: string | null;
    /**
     * the content of the post you'd like to send.
     */
    text?: string;
    /**
     * the IDs of any files that you'd like to send.
     */
    fileIds?: string[];
    /**
     * {unknown what this does. if you know, open a PR!}
     */
    mediaIds?: string[];
    /**
     * The options for a poll, if applicable.
     */
    poll?: {
        /**
         * the choices that you are presenting the user.
         */
        choices: string[];
        /**
         * Whether or not you'll allow the user to make multiple selections.
         */
        multiple: boolean;
        /**
         * {unknown what this does. if you know, open a PR!}
         */
        expiredAfter?: null | number;
        /**
         * The exact timestamp of when the poll expires. if null or undefined, the poll runs indefinitely.
         */
        expiresAt?: null | number;
    };
};

/**
 * The visibility type of the note.
 */
export enum NoteVisibility {
    Public = "public",
    Home = "home",
    Followers = "followers",
    Specified = "specified",
}

/**
 * The OnlineStatus that the user may be in.
 */
export enum OnlineStatus {
    /**
     * The homeserver does not know what the status is.
     * Possibly because the user is remote, blocked, silenced -- there's a myriad of reasons why.
     */
    Unknown = "unknown",
    /**
     * The user has been active on the homeserver recently.
     */
    Online = "online",
    /**
     * The user has posted recently.
     */
    Active = "active",
    /**
     * The user has not interacted with the homeserver recently.
     */
    Offline = "offline",
}

/**
 * A Deleted Note. Will only have the ID and when it was deleted.
 */
export type DeletedNote = {
    /**
     * The NoteID.
     */
    id: string;
    /**
     * a DateTime string that has the date/time of deletion.
     */
    deletedAt: string;
};

/**
 * A reaction event.
 * @remarks Probably a good idea to use this in conjunction with cardboard.showUser(userId).
 */
export type Reaction = {
    /**
     * The ID of the note.
     */
    noteId: string;
    /**
     * The reaction. either a UTF8 Emoji, or an emoji string (:+1: for example).
     */
    reaction: string;
    /**
     * The ID of the reactor.
     */
    userId: string;
};

/**
 * The raw note, as provided by Misskey.
 * @remarks If you're getting a raw misskey note, then something isn't right.
 * Open an issue.
 */
export type MisskeyNote = {
    /**
     * The ID of the note.
     */
    id: string;
    /**
     * the DateTime string of the creation date.
     */
    createdAt: string;
    /**
     * the DateTime string of the deletion date, if exists.
     */
    deletedAt?: string | null;
    /**
     * the content of the post. will return null if it's just media, or if the post is deleted.
     */
    text: string | null;
    /**
     * The content warning of the post, if exists.
     */
    cw?: string | null;
    /**
     * The ID of the user who created the post.
     */
    userId: string;
    /**
     * The user that created the note.
     */
    user: MisskeyLiteUser;
    /**
     * The parent post's ID.
     */
    replyId?: string | null;
    /**
     * The id of the note that was renoted.
     */
    renoteId?: string | null;
    /**
     * The parent of the post.
     */
    reply?: MisskeyNote;
    /**
     * The note that was renoted, if applicable.
     */
    renote?: MisskeyNote;
    /**
     * Whether or not the post should be invisible to you.
     */
    isHidden?: boolean;
    /**
     * The visibility of the note.
     */
    visibility: NoteVisibility;
    /**
     * IDs of users that were mentioned.
     */
    mentions?: string[];
    /**
     * If the visibility is specified, the userIDs of who can see this post.
     */
    visibleUserIds?: string[];
    /**
     * the IDs of files that are attached to this note.
     */
    fileIds?: string[];
    /**
     * The files that are attached to the note, if applicable.
     */
    files?: MisskeyFile[];
    /**
     * The hashtags used within the post.
     */
    tags?: string[];
    /**
     * A poll, if applicable.
     */
    poll?: {
        /**
         * When the poll expires.
         */
        expiresAt?: string | null;
        /**
         * Whether or not the poll is multiple choice or not.
         */
        multiple: boolean;
        /**
         * The choices that are presented in the poll.
         */
        choices: Array<{
            /**
             * See if you voted for a particular option at a glance.
             */
            isVoted: boolean;
            /**
             * The content of the poll.
             */
            text: string;
            /**
             * The amount of votes seen by the homeserver.
             */
            votes: number;
        }>;
    };
    /**
     * The emojis within the note.
     * @todo
     */
    emojis?: unknown;
    /**
     * the ID of the channel this was received from, if applicable.
     */
    channelId?: string | null;
    /**
     * The channel this note came from, if applicable.
     */
    channel?: {
        /**
         * The ID of the channel.
         */
        id: string;
        /**
         * The name of the channel.
         */
        name: string;
        /**
         * a hex code color for the channel.
         */
        color: string;
        /**
         * whether or not the entire channel is considered sensitive.
         */
        isSensitive: boolean;
        /**
         * Whether or not the channel permits renoting to the public timeline.
         */
        allowRenoteToExternal: boolean;
        /**
         * the userId.
         */
        userId: string | null;
    } | null;
    /**
     * Whether or not the Note may federate.
     */
    localOnly?: boolean;
    /**
     * How the note accepts reactions.
     */
    reactionAcceptance: ReactionAcceptance | null;
    /**
     * the current set of reacts by their emojis & Segregated by homeserver.
     */
    reactionEmojis: unknown;
    /**
     * The reactions themselves.
     */
    reactions: unknown;
    /**
     * The amount of reactions, as observed by the homeserver.
     */
    reactionCount: number;
    /**
     * The amount of renotes, as observed by the homeserver.
     */
    renoteCount: number;
    /**
     * The amount of replies found by the homeserver.
     * @remarks I'm unsure if this includes grandchildren, or just children.
     */
    repliesCount: number;
    /**
     * The remote link to the post, if from an external source.
     */
    url?: string;
    /**
     * A JSON-compatible object from the external source.
     */
    uri?: string;
    /**
     * {unknown. Know what this does? Make a PR!}
     */
    reactionAndUserPairCache?: string[];
    /**
     * The amount of clips this note has, as observed by the homeserver.
     */
    clippedCount?: number;
    /**
     * The reaction your account made, if exists.
     */
    myReaction?: string | null;
};

/**
 * Properties of a picture-like file.
 */
export type FileProperties = {
    /**
     * the width of the image-like file.
     */
    width: number;
    /**
     * the height of the image-like file.
     */
    height: number;
};
