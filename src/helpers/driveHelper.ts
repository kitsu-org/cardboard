import { openAsBlob } from "node:fs";
import type { CardboardClient } from "..";
import type { FileOptions, ShowOptions } from "../types/drive";
import type { MisskeyFolder } from "../types/file"; // Todo: Change this for a proper class.
import { PopulatedFolderError } from "./error";
import { FileItem } from "./fileHelper";
import { misskeyRequest } from "./requestHelper";

/**
 * The main Drive for you to access, delete, or update files.
 */
export class Drive {
    constructor(private readonly cardboard: CardboardClient) {}

    /**
     * Upload a file to the drive.
     * @param {string | Buffer} file - a string to a path, or a buffer containing your data.
     * @param {FileOptions} options - optional information you'd like to provide about the file.
     * @returns {Promise<MisskeyFile>}
     */
    async upload(
        file: Buffer | string,
        options: FileOptions,
    ): Promise<FileItem> {
        let upload: Blob;
        if (typeof file === "string") {
            upload = await openAsBlob(file);
        } else {
            upload = new Blob([file]);
        }
        const formData = new FormData();
        formData.set("file", upload);
        formData.set("i", this.cardboard.accessToken);
        if (options) {
            for (const option of Object.keys(options)) {
                //@ts-expect-error options[option] should be valid.
                formData.set(option, options[option]);
            }
        }
        return new FileItem(
            this.cardboard,
            await misskeyRequest(
                this.cardboard,
                "drive/files/create",
                formData,
            ),
        );
    }
    /**
     * show folders inside your misskey drive.
     * @param {ShowOptions} options - options to make sorting a bit quicker.
     */
    async getDirectories(
        options: Omit<ShowOptions, "type" | "sort">,
    ): Promise<MisskeyFolder[]> {
        return await misskeyRequest(this.cardboard, "drive/folders", options);
    }
    /**
     * show files inside your misskey drive.
     * @param {ShowOptions} options - options to make sorting a bit quicker.
     */
    async getFiles(options: ShowOptions): Promise<FileItem[]> {
        const files = await misskeyRequest(
            this.cardboard,
            "drive/files",
            options,
        );
        const preppedFiles: FileItem[] = [];
        for (const file of files) {
            preppedFiles.push(new FileItem(this.cardboard, file));
        }
        return preppedFiles;
    }

    /**
     * Delete a Folder, permanently. If it's not a folder, it'll throw an error.
     * @param folderId The ID of the folder that you'd like to delete.
     * @param recursive If cardboard should delete a folder that may potentially be populated.
     * @see {@link deleteFile} to delete a singular file.
     */
    async deleteFolder(folderId: string, recursive = false): Promise<void> {
        const checkForFolder = await misskeyRequest(
            this.cardboard,
            "drive/folders/show",
            { folderId },
        );
        if (
            (checkForFolder.foldersCount || checkForFolder.filesCount) &&
            !recursive
        ) {
            throw PopulatedFolderError;
        }
        return await misskeyRequest(this.cardboard, "drive/folders/delete", {
            folderId,
        });
    }

    /**
     * Delete a file, permanently. If it's not a file, this command will throw an error.
     * @param fileId The ID of the file that you'd like to delete.'
     * @see {@link deleteFolder} to delete a folder, potentially full of files.
     */
    async deleteFile(fileId: string): Promise<void> {
        // We'll specifically call drive/files/show to ensure that the file is present.
        // If it's not, it'll throw an error that prevents us from doing anything _too_ dangerous.
        await misskeyRequest(this.cardboard, "drive/files/show", { fileId });
        await misskeyRequest(this.cardboard, "drive/files/delete", { fileId });
    }
}
