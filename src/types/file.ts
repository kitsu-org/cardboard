import type { LiteUser } from "./user";

export type MisskeyFolder = {
    id: string;
    createdAt: string;
    name: string;
    parentId: string;
    foldersCount?: number;
    filesCount?: number;
    parent?: MisskeyFolder;
};

export type MisskeyFile = {
    id: string;
    createdAt: string;
    name: string;
    type: string;
    md5: string;
    size: number;
    isSensitive: boolean;
    blurhash: string | null;
    properties: {
        width?: number;
        height?: number;
        orientation?: number;
        avgColor?: number;
    };
    url: string;
    thumbnailUrl: string | null;
    comment: string | null;
    folderId: string | null;
    folder:
        | {
              id: string;
              createdAt: string;
              name: string;
              parentId: string;
              foldersCount: number;
              filesCount: number;
              parent: Record<string, unknown>;
          }
        | Record<string, unknown>;
    userId: string | null;
    user: LiteUser | null;
};
