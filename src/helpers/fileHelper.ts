import type { CardboardClient } from "..";
import type { MisskeyFile } from "../types";
import { misskeyRequest } from "./requestHelper";

export class FileItem {
    constructor(
        private readonly cardboard: CardboardClient,
        protected file: MisskeyFile,
    ) {}

    get info() {
        return this.file;
    }

    /**
     * Delete the file permanently.
     */
    async delete(): Promise<void> {
        await this.cardboard.drive.deleteFile(this.file.id);
    }

    async addCaption(caption: string) {
        const newFile = await misskeyRequest(
            this.cardboard.instance,
            this.cardboard.accessToken,
            "drive/files/update",
            { fileId: this.file.id, comment: caption },
        );
        this.file = newFile;
    }

    async setSensitivity(sensitive: boolean) {
        const newFile = await misskeyRequest(
            this.cardboard.instance,
            this.cardboard.accessToken,
            "drive/files/update",
            { fileId: this.file.id, isSensitive: sensitive },
        );
        this.file = newFile;
    }

    async rename(filename: string) {
        const newFile = await misskeyRequest(
            this.cardboard.instance,
            this.cardboard.accessToken,
            "drive/files/update",
            {
                fileId: this.file.id,
                name: filename,
            },
        );
        this.file = newFile;
    }
}
