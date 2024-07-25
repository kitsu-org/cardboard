import type { LiteUser } from "./user";

export type ServerStatusOptions = {
    defederate: boolean;
    nsfw: boolean;
    modNote: string;
};

export type InviteListOptions = {
    limit: number;
    offset: number;
    type: "unused" | "used" | "expired" | "all";
    sort: "+createdAt" | "-createdAt" | "+usedAt" | "-usedAt";
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
