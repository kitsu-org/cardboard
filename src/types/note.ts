import type { User } from "./user";

export enum ReactionAcceptance {
    LikeOnly = "likeOnly",
    LikeOnlyForRemote = "likeOnlyForRemote",
    NonSensitiveOnly = "nonSensitiveOnly",
    NonSensitiveOnlyForLocalLikeOnlyForRemote = "nonSensitiveOnlyForLocalLikeOnlyForRemote",
}

export type NoteOptions = {
    visibility?: NoteVisibility;
    visibileUserIds?: string[];
    cw?: string;
    localOnly?: boolean;
    reactionAcceptance?: ReactionAcceptance | null;
    noExtractMentions?: boolean;
    noExtractHashtags?: boolean;
    noExtractEmojis?: boolean;
    replyId?: string | null;
    renoteId?: string | null;
    channelId?: string | null;
    text?: string;
    fileIds?: unknown[];
    mediaIds?: unknown[];
    poll?: unknown[];
};

export enum NoteVisibility {
    Public = "public",
    Home = "home",
    Followers = "followers",
    Specified = "specified",
}

export enum OnlineStatus {
    Unknown = "unknown",
    Online = "online",
    Active = "active",
    Offline = "offline",
}

export type MisskeyNote = {
    id: string;
    createdAt: string;
    deletedAt?: string | null;
    text: string | null;
    cw?: string | null;
    userId: string;
    user: {
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
        onlineStatus: OnlineStatus;
        badgeRoles: {
            name: string;
            iconUrl: string | null;
            displayOrder: number;
        }[];
    };
    replyId?: string | null;
    renoteId?: string | null;
    reply?: MisskeyNote;
    renote?: MisskeyNote;
    isHidden?: boolean;
    visibility: NoteVisibility;
    mentions?: string[];
    visibleUserIds?: string[];
    fileIds?: string[];
    files?: File[];
    tags?: string[];
    poll?: {
        expiresAt?: string | null;
        multiple: boolean;
        choices: {
            isVoted: boolean;
            text: string;
            votes: number;
        }[];
    };
    emojis?: unknown;
    channelId?: string | null;
    channel?: {
        id: string;
        name: string;
        color: string;
        isSensitive: boolean;
        allowRenoteToExternal: boolean;
        userId: string | null;
    } | null;
    localOnly?: boolean;
    reactionAcceptance: string | null;
    reactionEmojis: unknown;
    reactions: unknown;
    reactionCount: number;
    renoteCount: number;
    repliesCount: number;
    uri?: string;
    url?: string;
    reactionAndUserPairCache?: string[];
    clippedCount?: number;
    myReaction?: string | null;
};

type FileProperties = {
    width: number;
    height: number;
};

type File = {
    id: string;
    createdAt: string;
    name: string;
    type: string;
    md5: string;
    size: number;
    isSensitive: boolean;
    blurhash: string;
    properties: FileProperties;
    url: string;
    thumbnailUrl: string;
    comment: string;
    folderId: string | null;
    folder: string | null;
    userId: string;
    user: User | null;
};
