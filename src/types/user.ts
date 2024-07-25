import type { MisskeyNote } from "./note";

export enum Visibility {
    Public = "public",
    Followers = "followers",
    Private = "private",
}

export type LiteUser = {
    id: string;
    name: string | null;
    username: string;
    host: string | null;
    avatarUrl: string | null;
    avatarBlurhash: string | null;
    avatarDecorations: {
        id: string;
        angle: number;
        flipH: boolean;
        url: string;
        offsetX: number;
        offsetY: number;
    }[];
    isAdmin?: boolean;
    isModerator?: boolean;
    isSilenced: boolean;
    noindex: boolean;
    isBot?: boolean;
    isCat?: boolean;
    speakAsCat?: boolean;
    instance?: {
        name: string | null;
        softwareName: string | null;
        softwareVersion: string | null;
        iconUrl: string | null;
        faviconUrl: string | null;
        themeColor: string | null;
    };
    emojis: unknown[];
    onlineStatus: "unknown" | "online" | "active" | "offline";
    badgeRoles: {
        name: string;
        iconUrl: string | null;
        displayOrder: number;
    }[];
};

export type SelfMisskeyUser = MisskeyUser & {
    twoFactorEnabled: boolean;
    usePasswordLessLogin: boolean;
    securityKeys: boolean;
    avatarId: string | null;
    bannerId: string | null;
    backgroundId: string | null;
    injectFeaturedNote: boolean;
    receiveAnnouncementEmail: boolean;
    alwaysMarkNsfw: boolean;
    autoSensitive: boolean;
    carefulBot: boolean;
    autoAcceptFollowed: boolean;
    noCrawle: boolean;
    preventAiLearning: boolean;
    isExplorable: boolean;
    isDeleted: boolean;
    twoFactorBackupCodesStock: string;
    hideOnlineStatus: boolean;
    hasUnreadSpecifiedNotes: boolean; //TODO: we can use these as part of bootstrap to emit events that make the bot retroactively check for info on startup.
    hasUnreadMentions: boolean; //TODO: ^
    hasUnreadAnnouncement: boolean;
    unreadAnnouncements: unknown[]; // Announcements are for users, not for bots. I won't focus efforts on it.
    hasUnreadAntenna: boolean;
    hasUnreadChannel: boolean;
    hasUnreadNotification: boolean;
    hasPendingReceivedFollowRequest: boolean;
    unreadNotificationsCouint: number;
    mutedWords: string[];
    hardMutedWords: string[];
    mutedInstances: string[];
    notificationRecieveConfig: unknown;
    emailNotificationTypes: string[];
    achievements: unknown[];
    loggedInDays: number;
    policies: Record<string, unknown>;
    email: string;
    emailVerified: boolean;
    signupReason: string | null;
    securityKeysList: {
        id: string;
        name: string;
        lastUsed: string;
    }[];
};

export type MisskeyUser = {
    id: string;
    name: string;
    username: string;
    host: string | null;
    avatarUrl: string | null;
    avatarBlurhash: string | null;
    description: string;
    createdAt: string;
    avatarDecorations: {
        id: string;
        angle: number;
    }[];
    isBot?: boolean;
    isCat?: boolean;
    instance?: {
        name: string | null;
        softwareName: string | null;
        softwareVersion: string | null;
        iconUrl: string | null;
        faviconUrl: string | null;
        themeColor: string | null;
    };
    isFollowing?: boolean;
    isFollowed?: boolean;
    hasPendingFollowRequestFromYou: boolean;
    hasPendingFollowRequestToYou: boolean;
    isBlocking: boolean;
    isBlocked: boolean;
    isMuted: boolean;
    isRenoteMuted: boolean;
    notify: "normal" | "none";
    withReplies: boolean;
    noindex: boolean;
    isSilenced: boolean;
    speakAsCat?: boolean;
    approved: boolean;
    followersCount: number;
    followingCount: number;
    notesCount: number;
    emojis: Record<string, string>;
    onlineStatus: "unknown" | "online" | "active" | "offline";
    badgeRoles: {
        name: string;
        iconUrl: string | null;
        displayOrder: number;
    };
    url: string | null;
    uri: string | null;
    movedTo: string | null;
    alsoKnownAs: string | null;
    updatedAt: string;
    lastFetchedAt: string | null;
    bannerUrl: string | null;
    bannerBlurhash: string | null;
    backgroundUrl: string | null;
    birthday: string | null;
    backgroundBlurhash: string | null;
    isLocked: boolean;
    isSuspended: boolean;
    location: string | null;
    ListenBrainz: string | null;
    lang: string | null;
    fields: {
        name: string;
        value: string;
    }[];
    verifiedLinks: string[];
    pinnedNoteIds: string[];
    pinnedNotes: MisskeyNote[]; // TODO : Make Note.ts
    pinnedPageId: string | null;
    pinnedPage: unknown[]; // Pages will not be supported by Cardboard right now.
    puiblicReactions: boolean;
    followingVisibility: Visibility;
    followersVisibility: Visibility;
    roles: {
        id: string;
        name: string;
        color: string | null;
        iconUrl: string | null;
        description: string;
        isModerator: boolean;
        isAdministrator: boolean;
        displayOrder: number;
    }[];
    memo: string | null;
    moderationNote?: string;
    isModerator: boolean;
    isAdmin: boolean;
};
export type PermissionsOptions = {
    session: string | null;
    name?: string | null;
    description?: string | null;
    iconUrl?: string | null;
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
export type MetaOptions = {
    location?: string;
    birthday?: string;
    followers?: {
        visibility?: "visible" | "friendsOnly" | "private";
        requireApproval?: boolean;
    };
    following?: {
        visibility?: "visible" | "friendsOnly" | "private";
    };
    visibility?: {
        online?: boolean;
        crawlers?: boolean;
        crawle: boolean;
        explore?: boolean;
        ai?: boolean;
        reactions?: boolean;
    };
    listenBrainz?: string;
    language?: string;
    fields?: { name: string; value: string }[];
    isBot?: boolean;
    catMode?: {
        earsVisible?: boolean;
        speech?: boolean;
    };
};
export type Role = {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    description: string;
    color: string | null;
    iconUrl: string | null;
    target: "manual" | "conditional";
    condFormula: Record<string, unknown>;
    isPublic: boolean;
    isModerator: boolean;
    isAdministrator: boolean;
    isExplorable?: boolean;
    asBadge: boolean;
    canEditMembersByModerator: boolean;
    displayOrder: boolean;
    policies: Record<string, unknown>;
    usersCount: number;
};
