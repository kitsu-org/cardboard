export type ServerSortOptions = {
    host?: string | null;
    blocked?: boolean | null;
    notResponding?: boolean | null;
    suspended?: boolean | null;
    silenced?: boolean | null;
    federating?: boolean | null;
    subscribing?: boolean | null;
    publishing?: boolean | null;
    nsfw?: boolean | null;
    bubble?: boolean | null;
    limit?: number;
    offset?: number;
    sort?:
        | "+pubSub"
        | "-pubSub"
        | "+notes"
        | "-notes"
        | "+users"
        | "-users"
        | "+following"
        | "-following"
        | "+followers"
        | "-followers"
        | "+firstRetrievedAt"
        | "-firstRetrievedAt"
        | "+latestRequestReceivedAt"
        | "-latestRequestReceivedAt"
        | null;
};
export type ModerationLogSorting = {
    limit?: number;
    sinceId?: string;
    untilId?: string;
    type?: string | null;
    userId?: string | null;
};
