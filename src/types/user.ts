import type { Announcement } from "./admin";
import type { MisskeyNote } from "./note";

export enum Visibility {
    Public = "public",
    Followers = "followers",
    Private = "private",
}

/**
 * A minified version of the user pulled, that does not contain all of the data a regular user has.
 */
export type LiteUser = {
    /**
     * The ID of the user, as assigned by the homeserver.
     */
    id: string;
    /**
     * The display name of the user.
     */
    name: string | null;
    /**
     * The permanently assigned username.
     */
    username: string;
    /**
     * The host that the user belongs to. Will be null or undefined if the user is from the homeserver.
     */
    host: string | null;
    /**
     * The publicly accessible URL to the avatar photo.
     */
    avatarUrl: string | null;
    /**
     * An MD5 hash used to calculate a super-low-res image for if the image doesn't load.
     */
    avatarBlurhash: string | null;
    /**
     * Decorations that may be applied to the user's avatar.
     */
    avatarDecorations: Array<{
        /**
         * The ID of the decoration.
         */
        id: string;
        /**
         * The angle that the decoration was positioned at.
         */
        angle: number;
        /**
         * Whether or not the decoration is flipped horizontally
         */
        flipH: boolean;
        /**
         * The publicly accessible URL to the decoration photo.
         */
        url: string;
        /**
         * How many units to offset from the center on the X-Axis
         */
        offsetX: number;
        /**
         * How many units to offset from the center on the Y-Axis
         */
        offsetY: number;
    }>;
    /**
     * Whether or not the user is an administrator.
     */
    isAdmin?: boolean;
    /**
     * Whether or not the user has moderation capabilities.
     */
    isModerator?: boolean;
    /**
     * Whether or not the user is able to show up in feeds regularly.
     */
    isSilenced: boolean;
    /**
     * Whether or not the user wants to be indexed (like w/ search engines, for example.)
     */
    noindex: boolean;
    /**
     * Whether the user self-identifies as a bot.
     */
    isBot?: boolean;
    /**
     * Whether the user self-identifies as a cat, to get cat-ears and a modification to speech.
     */
    isCat?: boolean;
    /**
     * Whether or not the user has opted to disabled the modification to speech.
     */
    speakAsCat?: boolean;
    /**
     * instance-specific information, for remote servers.
     */
    instance?: {
        /**
         * The name of the instance, if provided.
         */
        name: string | null;
        /**
         * The name of the software that the remote user is using, if provided.
         */
        softwareName: string | null;
        /**
         * The version of the software that the remote user is using, if provided.
         */
        softwareVersion: string | null;
        /**
         * The URL to the icon, as provided by the remote server
         */
        iconUrl: string | null;
        /**
         * the URL to the favicon, as provided by the remote server
         */
        faviconUrl: string | null;
        /**
         * The hex code of the theme color, as provided by the remote server.
         */
        themeColor: string | null;
    };
    /**
     * Key-value pair of emojis that is on the user's displayname, {"emoji-name": "Url-to-photo"}
     */
    emojis: Record<string, string>;
    /**
     * The "status" of the user.
     */
    onlineStatus?: "unknown" | "online" | "active" | "offline";
    /**
     * The badges that the user has, as assigned by the homeserver (automatically) or by the administrators.
     */
    badgeRoles: Array<{
        /**
         * The human-readable name of the badge.
         */
        name: string;
        /**
         * The icon to display, if there is any.
         */
        iconUrl: string | null;
        /**
         * In which order to display the badge.
         */
        displayOrder: number;
    }>;
};

/**
 * The SelfUser is an extended MisskeyUser that
 */
export type SelfMisskeyUser = MisskeyUser & {
    /**
     * If 2FA is enabled on the account.
     */
    twoFactorEnabled: boolean;
    /**
     * if the user can use a hardware key to sign-in without using their password.
     */
    usePasswordLessLogin: boolean;
    /**
     * if the user has a security key or passkey on their account.
     */
    securityKeys: boolean;
    /**
     * the ID of the file used for the avatar.
     */
    avatarId: string | null;
    /**
     * the ID of the file used for the banner.
     */
    bannerId: string | null;
    /**
     * the ID of the file used for the background.
     */
    backgroundId: string | null;
    /**
     * {unknown}
     */
    injectFeaturedNote: boolean;
    /**
     * {unknown}
     */
    receiveAnnouncementEmail: boolean;
    /**
     * If the user automatically marks their posts with CWs.
     */
    alwaysMarkNsfw: boolean;
    /**
     * if the user automatically marks their files as sensitive.
     */
    autoSensitive: boolean;
    /**
     * {unknown}
     */
    carefulBot: boolean;
    /**
     * If the user automatically accepts friend requests.
     */
    autoAcceptFollowed: boolean;
    /**
     * {unknown}
     */
    noCrawle: boolean;
    /**
     * Prevent (compliant) AI from viewing your feed for AI learning.
     */
    preventAiLearning: boolean;
    /**
     * if the user can appear on the explorable feed - as a featured user, for example.
     */
    isExplorable: boolean;
    /**
     * if the user has been deleted.
     */
    isDeleted: boolean;
    /**
     * The remaining codes that can be used to gain emergency access to the account.
     */
    twoFactorBackupCodesStock: string;
    /**
     * Whether or not to hide the online status
     */
    hideOnlineStatus: boolean;
    /**
     * Whether or not the user has an unread DM (specified note)
     */
    hasUnreadSpecifiedNotes: boolean; //TODO: we can use these as part of bootstrap to emit events that make the bot retroactively check for info on startup.
    /**
     * Whether of not the user has an unread mention.
     */
    hasUnreadMentions: boolean; //TODO: ^
    /**
     * Whether or not the current user has unread announcements they need to follow up on.
     */
    hasUnreadAnnouncement: boolean;
    /**
     * the announcements that the user needs to follow up on.
     */
    unreadAnnouncements: Announcement[];
    /**
     * If the user has any antennas that have new notes.
     */
    hasUnreadAntenna: boolean;
    /**
     * If the user has any channels that have new notes.
     */
    hasUnreadChannel: boolean;
    /**
     * if the user has new mentions or DMs to follow up on.
     */
    hasUnreadNotification: boolean;
    /**
     * if the user has a pending follow request to accept or reject.
     */
    hasPendingReceivedFollowRequest: boolean;
    /**
     * the count of unread notifications.
     */
    unreadNotificationsCount: number;
    /**
     * a list of muted words that will be collapsed and prevented from being seen by the user.
     */
    mutedWords: string[];
    /**
     * a list of hard-muted words. [effects are unknown]
     */
    hardMutedWords: string[];
    /**
     * a list of muted instance that will not show up in the feed.
     */
    mutedInstances: string[];
    /**
     * {unknown}
     */
    notificationReceiveConfig: unknown;
    /**
     * {unknown}
     */
    emailNotificationTypes: string[];
    /**
     * Achievements that the user has earned thus far.
     */
    achievements: unknown[];
    /**
     * The amount of days the user has logged in for.
     */
    loggedInDays: number;
    /**
     * {unknown.}
     */
    policies: Record<string, unknown>;
    /**
     * The email associated with the account.
     */
    email: string;
    /**
     * Whether or not the email has been verified (in the eyes of the homeserver)
     */
    emailVerified: boolean;
    /**
     * The user-provided reason for signing up.
     */
    signupReason: string | null;
    /**
     * a list of hardware keys used to authenticate the user
     */
    securityKeysList: Array<{
        /**
         * The homeserver-generated id of the security key
         */
        id: string;
        /**
         * The human-set name made by the user.
         */
        name: string;
        /**
         * The last time the security was used.
         */
        lastUsed: string;
    }>;
};

/**
 * The raw Misskey User. You should really not be using this.
 * If you need to access this, put in an issue!
 */
export type MisskeyUser = LiteUser & {
    /**
     * the self-written description of the user.
     */
    description: string;
    /**
     * When the user was registered - or first discovered by the homeserver.
     */
    createdAt: string;
    /**
     * whether or not you're following the user.
     */
    isFollowing?: boolean;
    /**
     * Whether or not the user is following you.
     */
    isFollowed?: boolean;
    /**
     * whether or not you are waiting for a pending follow request.
     */
    hasPendingFollowRequestFromYou: boolean;
    /**
     * whether or not the user is waiting for a follow request.
     */
    hasPendingFollowRequestToYou: boolean;
    /**
     * whether or not the user is blocking you.
     */
    isBlocking: boolean;
    /**
     * whether or not the user is blocked by you.
     */
    isBlocked: boolean;
    /**
     * whether or not the user is muted by you.
     */
    isMuted: boolean;
    /**
     * whether or not the user is prevented from showing renotes on your feed.
     */
    isRenoteMuted: boolean;
    /**
     * {unknown}
     */
    notify: "normal" | "none";
    /**
     * {unknown}
     */
    withReplies: boolean;
    /**
     * whether or not the user is approved to be on your instance.
     */
    approved: boolean;
    /**
     * the amount of followers the user has.
     */
    followersCount: number;
    /**
     * the amount of users the user follows.
     */
    followingCount: number;
    /**
     * the amount of notes created.
     */
    notesCount: number;
    /**
     * the url of the remote instance, if applicable.
     */
    url: string | null;
    /**
     * {unknown}
     */
    uri: string | null;
    /**
     * the URL of the new account, if the user migrated.
     */
    movedTo: string | null;
    /**
     * previous accounts the user has migrated to this one.
     */
    alsoKnownAs: string[] | null;
    /**
     * the last time the user has updated their profile (and it was discovered by the homeserver)
     */
    updatedAt: string;
    /**
     * the last time the user has been fetched by the homeserver.
     */
    lastFetchedAt: string | null;
    /**
     * a publicly accessible image that is used for the banner.
     */
    bannerUrl: string | null;
    /**
     * a hash of the banner image, used to generate a placeholder if the image fails to load.
     */
    bannerBlurhash: string | null;
    /**
     * a publicly accessible image that is used for the background of the profile.
     */
    backgroundUrl: string | null;
    /**
     * a Date-Time string that is used for the birthday.
     */
    birthday: string | null;
    /**
     * a hash of the background image, used to generate a placeholder if the image fails to load.
     */
    backgroundBlurhash: string | null;
    /**
     * {unknown}
     */
    isLocked: boolean;
    /**
     * whether or not the user is suspended.
     */
    isSuspended: boolean;
    /**
     * the user's location.
     */
    location: string | null;
    /**
     * the user's ListenBrainz username.
     */
    ListenBrainz: string | null;
    /**
     * The user's self-set language.
     */
    lang: string | null;
    /**
     * The user's self-set fields.
     */
    fields: Array<{
        name: string;
        value: string;
    }>;
    /**
     * A list of links that the user has control over
     */
    verifiedLinks: string[];
    /**
     * Ids of notes that were pinned to the top of the profile.
     */
    pinnedNoteIds: string[];
    /**
     * Notes that are pinned to the top of the user's profile.
     */
    pinnedNotes: MisskeyNote[];
    /**
     * {unknown, not planned}
     */
    pinnedPageId: string | null;
    /**
     * {unknown, not planned}
     */
    pinnedPage: unknown[]; // Pages will not be supported by Cardboard right now.
    /**
     * Whether or not the user's reactions are publicly viewable
     */
    publicReactions: boolean;
    /**
     * Who can view the users the user follows
     */
    followingVisibility: Visibility;
    /**
     * Who can view the users following the user
     */
    followersVisibility: Visibility;
    /**
     * Roles associated with the user
     */
    roles: Role[];
    /**
     * A personally-set memo.
     */
    memo: string | null;
    /**
     * A moderation note that is accessible by moderation and administration.
     */
    moderationNote?: string;
};
export type PermissionsOptions = {
    session: string | null;
    name?: string | null;
    description?: string | null;
    iconUrl?: string | null;
    /**
     * The permissions that can be assigned to the user.
     */
    permission:
        | "read:account"
        | "write:account"
        | "read:blocks"
        | "write:blocks"
        | "read:drive"
        | "write:drive"
        | "read:favorites"
        | "write:favorites"
        | "read:following"
        | "write:following"
        | "read:messaging"
        | "write:messaging"
        | "read:mutes"
        | "write:mutes"
        | "write:notes"
        | "read:notifications"
        | "write:notifications"
        | "read:reactions"
        | "write:reactions"
        | "write:votes"
        | "read:pages"
        | "write:pages"
        | "write:page-likes"
        | "read:page-likes"
        | "read:user-groups"
        | "write:user-groups"
        | "read:channels"
        | "write:channels"
        | "read:gallery"
        | "write:gallery"
        | "read:gallery-likes"
        | "write:gallery-likes"
        | "read:flash"
        | "write:flash"
        | "read:flash-likes"
        | "write:flash-likes"
        | "write:invite-codes"
        | "read:invite-codes"
        | "write:clip-favorite"
        | "read:clip-favorite"
        | "read:federation"
        | "write:report-abuse"
        | "read:admin:abuse-user-reports"
        | "write:admin:delete-account"
        | "write:admin:delete-all-files-of-a-user"
        | "read:admin:index-stats"
        | "read:admin:table-stats"
        | "read:admin:user-ips"
        | "read:admin:meta"
        | "write:admin:reset-password"
        | "write:admin:resolve-abuse-user-report"
        | "write:admin:send-email"
        | "read:admin:server-info"
        | "read:admin:show-moderation-log"
        | "read:admin:show-user"
        | "write:admin:suspend-user"
        | "write:admin:approve-user"
        | "write:admin:nsfw-user"
        | "write:admin:unnsfw-user"
        | "write:admin:silence-user"
        | "write:admin:unsilence-user"
        | "write:admin:unset-user-avatar"
        | "write:admin:unset-user-banner"
        | "write:admin:unsuspend-user"
        | "write:admin:meta"
        | "write:admin:user-note"
        | "write:admin:roles"
        | "read:admin:roles"
        | "write:admin:relays"
        | "read:admin:relays"
        | "write:admin:invite-codes"
        | "read:admin:invite-codes"
        | "write:admin:announcements"
        | "read:admin:announcements"
        | "write:admin:avatar-decorations"
        | "read:admin:avatar-decorations"
        | "write:admin:federation"
        | "write:admin:account"
        | "read:admin:account"
        | "write:admin:emoji"
        | "read:admin:emoji"
        | "write:admin:queue"
        | "read:admin:queue"
        | "write:admin:promo"
        | "write:admin:drive"
        | "read:admin:drive"
        | "write:admin:ad"
        | "read:admin:ad"[];
};
/**
 * Options defined by the user.
 */
export type MetaOptions = {
    /**
     * A string of the location, set by the user.
     */
    location?: string;
    /**
     * A Date-Time String representing the user's birthday.
     * @remarks Please be careful while you're parsing the string. More than a few users have set their birthdays to impossible dates, like 0000-00-00, or 4000-62-24.
     */
    birthday?: string;
    /**
     * How the user responds to followers.
     */
    followers?: {
        /**
         * The visibility of the followers.
         */
        visibility?: "visible" | "friendsOnly" | "private";
        /**
         * Whether or not you require approval to follow the user.
         */
        requireApproval?: boolean;
    };
    /**
     * information about the userFollowing.
     */
    following?: {
        /**
         * The visibility of who the user follows.
         */
        visibility?: "visible" | "friendsOnly" | "private";
    };
    /**
     * What you're able to see.
     */
    visibility?: {
        /**
         * if the user has been online
         */
        online?: boolean;
        /**
         * If the user can been seen by crawlers
         */
        crawlers?: boolean;
        /**
         * {unknown! know what this endpoint does? send in a PR!}
         */
        crawle: boolean;
        /**
         * If the user can show up in the exploration tab.
         */
        explore?: boolean;
        /**
         * If the user can be used for AI generation.
         */
        ai?: boolean;
        /**
         * If the reactions from the user are public.
         */
        reactions?: boolean;
    };
    /**
     * The username of the user's ListenBrainz account.
     */
    ListenBrainz?: string;
    /**
     * A string containing the user's language.
     */
    language?: string;
    /**
     * A list of custom fields that the user has set.
     */
    fields?: Array<{ name: string; value: string }>;
    /**
     * Whether the user has self-identified as a bot.
     */
    isBot?: boolean;
    /**
     * Whether the user has identified (and to what extent do they identify) as a cat
     */
    catMode?: {
        /**
         * if the ears should be visible
         */
        earsVisible?: boolean;
        /**
         * If the speech should be altered to be cat-like
         */
        speech?: boolean;
    };
};
/**
 * A Role assigned to a user.
 */
export type Role = {
    /**
     * The ID of the role, as generated by the homeserver.
     */
    id: string;
    /**
     * a Date-Time string representing the creation of the role.
     */
    createdAt: string;
    /**
     * a Date-Time string representing the last time the role was updated by an administrator.
     */
    updatedAt: string;
    /**
     * a human-readable name for the role.
     */
    name: string;
    /**
     * a description, if set.
     */
    description: string;
    /**
     * a hex code color, commonly for the border of the role.
     */
    color: string | null;
    /**
     * A publicly accessible URL leading to an icon that will be shown beside the username and on the profile.
     */
    iconUrl: string | null;
    /**
     * if the role is assigned by an administrator, or by automatically (following set rules).
     */
    target: "manual" | "conditional";
    /**
     * the conditions that need to be met for the user to be given the role.
     */
    condFormula: Record<string, unknown>;
    /**
     * whether or not the role can be publicly accessed and viewed.
     */
    isPublic: boolean;
    /**
     * whether or not the user is granted moderation capabilities by the role.
     */
    isModerator: boolean;
    /**
     * whether or not the user is granted administrative capacity by the role.
     */
    isAdministrator: boolean;
    /**
     * whether or not someone is able to view the users who are associated with the role.
     */
    isExplorable?: boolean;
    /**
     * Whether or not the role will show up as a badge on the profile/
     */
    asBadge: boolean;
    /**
     * Whether or not a moderator is permitted to change the members of the role.
     */
    canEditMembersByModerator: boolean;
    /**
     * the order in which this role is to be shown.
     */
    displayOrder: number;
    /**
     * The policies that are modified by the role.
     */
    policies: Record<string, unknown>;
    /**
     * The amount of users assigned to the role.
     */
    usersCount: number;
};
