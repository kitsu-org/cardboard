import type { MisskeyNote } from "./note";

export enum Visibility {
    Public = "public",
    Followers = "followers",
    Private = "private",
}

// ---  Tip: ---
// Syntax:
// const a = Visibility.Public;
// a === "public" === Visibility.Public
//
// You can also cast (aka convert) string values to Visibility
// const a = "public" as Visibility;

export type SelfUser = User & {
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

export type User = {
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
