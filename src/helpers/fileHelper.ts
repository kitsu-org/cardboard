import type { CardboardClient } from "..";
import type { MisskeyFile, MisskeyFolder } from "../types/file";
import { misskeyRequest } from "./requestHelper";
import { LiteUser } from "./userHelper";

/**
 * A retrieved file.
 */
export class FileItem {
    constructor(
        private readonly cardboard: CardboardClient,
        protected file: MisskeyFile,
    ) {}

    /**
     * the raw MisskeyFile.
     * @deprecated
     */
    get info(): MisskeyFile {
        return this.file;
    }

    get id(): string {
        return this.file.id;
    }

    get createdAt(): Date {
        return new Date(this.file.createdAt);
    }

    get type(): string {
        return this.file.type;
    }

    get md5(): string {
        return this.file.md5;
    }

    /**
     * Get the size in BITS (Not bytes!)
     * Will return 0 if the file is from a remote server & remote caching is disabled.
     */
    get size(): number {
        return this.file.size;
    }

    get isSensitive(): boolean {
        return this.file.isSensitive;
    }

    get blurhash(): string | null {
        return this.file.blurhash;
    }

    get properties(): MisskeyFile["properties"] {
        return this.file.properties;
    }

    get url(): string {
        return this.file.url;
    }

    get thumbnailUrl(): string | null {
        return this.file.thumbnailUrl;
    }

    get comment(): string | null {
        return this.file.comment;
    }

    get folderId(): string | null {
        return this.file.folderId;
    }

    get folder(): MisskeyFolder {
        return this.file.folder;
    }

    get userId(): string {
        return this.file.userId;
    }

    get user(): LiteUser | null {
        if (this.file.user) {
            return new LiteUser(this.cardboard, this.file.user);
        }
        return null;
    }

    /**
     * Delete the file permanently.
     */
    async delete(): Promise<void> {
        await this.cardboard.drive.deleteFile(this.file.id);
    }

    /**
     * Apply a description to the file, otherwise known as alt-text.
     * @param caption the alt text you wish to apply to the file.
     */
    async addCaption(caption: string): Promise<void> {
        const newFile = await misskeyRequest(
            this.cardboard,
            "drive/files/update",
            { fileId: this.file.id, comment: caption },
        );
        this.file = newFile;
    }

    /**
     * Set the sensitivity of the file - warning users that it may contain nsfw/nsfl content.
     * @param sensitive Shall the file be set to sensitive or not?
     */
    async setSensitivity(sensitive: boolean): Promise<void> {
        const newFile = await misskeyRequest(
            this.cardboard,
            "drive/files/update",
            { fileId: this.file.id, isSensitive: sensitive },
        );
        this.file = newFile;
    }

    /**
     * Rename the file to something else.
     * @param filename the new name of the file.
     */
    async rename(filename: string): Promise<void> {
        const newFile = await misskeyRequest(
            this.cardboard,
            "drive/files/update",
            {
                fileId: this.file.id,
                name: filename,
            },
        );
        this.file = newFile;
    }
}
