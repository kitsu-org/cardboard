import type { CardboardClient } from "..";
import type { MisskeyFile } from "../types/file";
import { misskeyRequest } from "./requestHelper";

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
     * @todo DEPRECATE THIS KIO PLEASE
     */
    get info(): MisskeyFile {
        return this.file;
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
