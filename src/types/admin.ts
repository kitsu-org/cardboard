import type { LiteUser, MisskeyUser } from "./user";

export type ServerStatusOptions = {
    defederate: boolean;
    nsfw: boolean;
    modNote: string;
};

export type InviteListOptions = {
    limit?: number;
    offset?: number;
    type?: "unused" | "used" | "expired" | "all";
    sort?: "+createdAt" | "-createdAt" | "+usedAt" | "-usedAt";
};

export type Invite = {
    id: string;
    code: string;
    expiresAt: string;
    createdAt: string;
    createdBy: LiteUser;
    usedBy: LiteUser | null;
    usedAt: string | null;
    used: boolean;
}[];

type ReportType = "combined" | "local" | "remote";

export type ReportOptions = {
    limit: number;
    sinceId: string;
    untilId: string;
    state: string;
    reporterOrigin: ReportType;
    targetUserOrigin: ReportType;
    forwarded: boolean;
};

export type AnnouncementOptions = {
    imageUrl?: string | null;
    icon?: "info" | "warning" | "error" | "success";
    display?: "normal" | "banner" | "dialog";
    forExistingUsers?: boolean;
    silence?: boolean;
    needConfirmationToRead?: boolean;
    userId?: string;
};
export type AnnouncementResponse = {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    text: string;
    imageUrl: string;
};

export type Report = {
    id: string;
    createdAt: string;
    comment: string;
    resolved: boolean;
    reporterId: string;
    targetUserId: string;
    assigneeId: string;
    reporter: MisskeyUser | null;
    targetUser: MisskeyUser | null;
    assignee: MisskeyUser;
};

export type AdvertisementOptions = {
    memo?: string | null;
    place?: "square" | "horizontal" | "horizontal-big";
    dayOfWeek?: number; // I don't understand the numbers here...
    ratio?: number;
    startsAt: number;
    expiresAt: number;
    priority: "middle";
};
export type ReportSortingOptions = {
    limit?: number;
    sinceId?: string;
    untilId?: string;
    state?: string | null;
    reporterOrigin?: "combined" | "local" | "remote";
    targetUserOrigin?: "combined" | "local" | "remote";
    forwarded?: boolean;
};
