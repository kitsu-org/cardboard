import type { CardboardClient } from "..";
import type {
    AdvertisementOptions,
    AnnouncementOptions,
    AnnouncementResponse,
    Invite,
    InviteListOptions,
    Report,
    ReportSortingOptions,
    ServerStatusOptions,
} from "../types/admin";
import type { Emoji } from "../types/emoji";
import type { ModerationLogSorting } from "../types/sorting";
import type { MisskeyUser, Role } from "../types/user";
import { NotImplementedError } from "./error";
import { FileItem } from "./fileHelper";
import { IterableArray } from "./iterableArrayHelper";
import { misskeyRequest } from "./requestHelper";
import { User } from "./userHelper";

export class Admin {
    constructor(protected readonly cardboard: CardboardClient) {}

    /**
     * Get invites, as defined by the options.
     * By default, will get 30 of all usedType invites.
     * @param {InviteListOptions} options any optional settings you would like to define.
     * @returns {Promise<Invite>}
     */
    public async getInvites(options?: InviteListOptions): Promise<Invite> {
        const response = await misskeyRequest(
            this.cardboard,
            "admin/invite/list",
            options,
        );
        return new IterableArray(
            this.cardboard,
            "admin/invite/list",
            options,
            response,
            true,
        );
    }

    /**
     * Generate a new invite key.
     * @param qty - The amount of invitation keys you'd like to generate.
     * @param expiry A DateTime String.
     * @returns {Promise<Invite>} A list of invites that were generated.
     */
    public async createInvite(
        qty = 1,
        expiry?: string | null,
    ): Promise<Invite> {
        return await misskeyRequest(this.cardboard, "admin/invite/create", {
            count: qty,
            expiresAt: expiry,
        });
    }

    /**
     * Revoke an invite, rendering it permanently unusable.
     * No effect if it's already used.
     * @param inviteId the inviteId that you would like to delete.
     */
    public async deleteInvite(inviteId: string): Promise<void> {
        await misskeyRequest(this.cardboard, "invite/delete", {
            inviteId,
        });
    }

    /**
     * Alias to get the approval list required. getApprovalsList makes assumptions, that you have a low user registration influx.
     * Not recommended for massive servers.
     */
    public async getApprovalsList(): Promise<IterableArray<MisskeyUser>> {
        const options = {
            limit: 100,
            allowPartial: true,
            origin: "local",
            sort: "+createdAt",
            state: "approved",
        };
        const response = await misskeyRequest(
            this.cardboard,
            "admin/show-users",
            options,
        );
        return new IterableArray(
            this.cardboard,
            "admin/show-users",
            options,
            response,
            true,
        );
    }

    /**
     * Get a list of roles.
     */
    public async getRoles(): Promise<Role[]> {
        return await misskeyRequest(this.cardboard, "admin/roles/list");
    }

    /**
     * Get a singular role, if you are certain of it's ID.
     * @param roleId the ID of the role.
     * @returns {Promise<Role>}
     */
    public async showRole(roleId: string): Promise<Role> {
        return await misskeyRequest(this.cardboard, "admin/roles/show", {
            roleId,
        });
    }

    /**
     * Assign a role to a user, with an optional duration of time.
     * @param roleId the id of the role that you'd like to assign.
     * @param userId the userId.
     * @param expiration An optional integer of when you'd like the role to expire.
     */
    public async addRoleToUser(
        roleId: string,
        userId: string,
        expiration?: number | null,
    ) {
        await misskeyRequest(this.cardboard, "admin/roles/assign", {
            roleId,
            userId,
            expiresAt: expiration,
        });
    }

    /**
     * Remove the
     * @param roleId the id of the role that you'd like to remove.
     * @param userId the userId.
     */
    public async removeRoleFromUser(
        roleId: string,
        userId: string,
    ): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/roles/unassign", {
            roleId,
            userId,
        });
    }

    /**
     * Create a new role.
     * @param options The options you would like the role to have.
     * @returns {Promise<Role>}
     */
    public async createRole(
        options: Omit<Role, "id" | "createdAt" | "updatedAt" | "usersCount">,
    ): Promise<Role> {
        return await misskeyRequest(
            this.cardboard,
            "admin/roles/create",
            options,
        );
    }

    /**
     * Change options within the role.
     * @param roleId the ID of the role that you'd like to modify.
     * @param options Options that you would like to modify.
     */
    public async setRole(
        roleId: string,
        options: Omit<Role, "id" | "createdAt" | "updatedAt" | "usersCount">,
    ): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/roles/update", {
            roleId,
            ...options,
        });
    }

    public async deleteRole(roleId: string): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/roles/delete/", { roleId });
    }

    /**
     * Create an emoji from a drive file.
     * @param fileId the ID of the file in the misskey Drive.
     * @param name The name of the emoji. Will translate to the name. f.e, :cardboard:.
     * @param options Additional options to finetune how users may use the emoji.
     * @returns {Promise<Emoji>}
     */
    public async createEmoji(
        fileId: string,
        name: string,
        options: Omit<Emoji, "id" | "fileId" | "name">,
    ): Promise<Emoji> {
        return await misskeyRequest(this.cardboard, "admin/emoji/add", {
            name,
            fileId,
            ...options,
        });
    }

    /**
     * Update the emoji.
     * @param emojiId the ID of the emoji.
     * @param options The options you would like to modify.
     */
    public async setEmoji(
        emojiId: string,
        options: Omit<Emoji, "id">,
    ): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/emoji/update", {
            id: emojiId,
            ...options,
        });
    }

    /**
     * Deletes emojis from the server.
     * @param emojiId the ids of the emojis you wish to delete.
     */
    public async deleteEmoji(emojiId: string[]): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/emoji/delete-bulk", {
            ids: emojiId,
        });
    }

    // TODO: Avatar Decorations look a little bit difficult at the moment.

    /**
     * Set the status of a server, like defederated, suspended, or forced as NSFW.
     * @param instanceUri The instance you would like to target.
     * @param options What you would like the server to report as.
     */
    public async setServerFederationStatus(
        instanceUri: string,
        options: ServerStatusOptions,
    ): Promise<void> {
        await misskeyRequest(
            this.cardboard,
            "admin/federation/update-instance",
            {
                host: instanceUri,
                isSuspended: options.defederate,
                isNSFW: options.nsfw,
                moderationNote: options.modNote,
            },
        );
    }

    /**
     * Remove all users who are following local users.
     * @param instanceUri the instance you would like to target.
     */
    public async removeAllFromFollowing(instanceUri: string): Promise<void> {
        await misskeyRequest(
            this.cardboard,
            "admin/federation/remove-all-following",
            {
                host: instanceUri,
            },
        );
    }

    /**
     * Get the entire drive for the instance.
     * >> Not Implemented yet, see issue. <<
     * NOTE: Users will consider this invasive if you are regularly accessing their drive without permission!
     * @see https://github.com/kitsu-org/cardboard/issues/4
     */
    public getFullDrive(): NotImplementedError {
        throw NotImplementedError;
    }

    /**
     * Empty the drive of a user.
     * NOTE: This command can make a user pretty unhappy - so you should be _very_ careful about invoking it!
     * @param userId the user of the drive that you'd like to empty.
     */
    public async emptyUserDrive(userId: string): Promise<void> {
        await misskeyRequest(
            this.cardboard,
            "admin/delete-all-files-of-a-user",
            { userId },
        );
    }

    /**
     *
     * @param options Options to help you filter what users you'd like to retrieve.
     * @returns
     */
    public async getUsers(options?: {
        username?: string;
        host?: string | null;
        limit?: number;
        origin?: "local" | "remote" | "combined";
        state: string;
    }): Promise<IterableArray<User>> {
        const response = await misskeyRequest(
            this.cardboard,
            "admin/show-users",
            options,
        );
        const users: User[] = [];
        for (const user of response) {
            users.push(new User(this.cardboard, user));
        }
        return new IterableArray(
            this.cardboard,
            "admin/show-users",
            options,
            users,
            true,
        );
    }

    /**
     * Delete a file from the drive.
     * @param fileId the ID of the file that you'd like to delete.
     */
    public async deleteDriveFile(fileId: string): Promise<void> {
        await misskeyRequest(this.cardboard, "drive/files/delete", {
            fileId,
        });
    }

    /**
     * Force a file to become sensitive (or force it to be visible).
     * @param fileId the ID of the file that you'd like to modify.
     * @param sensitive set whether the file is sensitive or not.
     * @returns {Promise<FileItem>}
     */
    public async forceFileSensitivity(
        fileId: string,
        sensitive: boolean,
    ): Promise<FileItem> {
        const file = await misskeyRequest(
            this.cardboard,
            "drive/files/update",
            {
                fileId,
                isSensitive: sensitive,
            },
        );
        return new FileItem(this.cardboard, file);
    }

    public async createAnnouncement(
        title: string,
        message: string,
        options?: AnnouncementOptions,
    ): Promise<AnnouncementResponse> {
        return await misskeyRequest(
            this.cardboard,
            "admin/announcements/create",
            {
                title,
                text: message,
                imageUrl: options?.imageUrl || null,
                icon: options?.icon,
                display: options?.display,
                forExistingUsers: options?.forExistingUsers,
                silence: options?.silence,
                needConfirmationToRead: options?.needConfirmationToRead,
                userId: options?.userId,
            },
        );
    }

    /**
     * Make changes to an announcement.
     * @param announcementId The ID of the announcement.
     * @param options The options you would like to modify.
     */
    public async setAnnouncement(
        announcementId: string,
        options: AnnouncementOptions,
    ): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/announcements/update", {
            id: announcementId,
            ...options,
        });
    }

    /**
     * (un)archive an announcement.
     * @param announcementId the id of the announcement you would like to (un)archive.
     * @param archived If you'd like the announcement to be archived or not.
     */
    public async archiveAnnouncement(
        announcementId: string,
        archived = true,
    ): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/announcements/update", {
            id: announcementId,
            isActive: !archived,
        });
    }

    /**
     * Delete an announcement permanently.
     * @see archiveAnnouncement you shouldn't hide announcements from users - archive them so they don't get confused.
     * @param announcementId the id of the announcement.
     */
    public async deleteAnnouncement(announcementId: string): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/announcements/delete", {
            id: announcementId,
        });
    }

    /**
     * Create an advertisement.
     * @param url The URL to direct to on click.
     * @param imageUrl A URL to a photo.
     * @param options Default information that you are able to customize.
     */
    public async createAdvertisement(
        url: string,
        imageUrl: string,
        options: AdvertisementOptions,
    ): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/ad/create ", {
            url,
            memo: options.memo || "",
            place: options.place || "horizontal",
            priority: options.priority || "middle",
            ratio: options.ratio || 1,
            expiresAt: options.expiresAt || Date.now() + 15778476000000, // 5 Years!
            startsAt: options.startsAt || Date.now(),
            imageUrl,
            dayOfWeek: options.dayOfWeek || 0,
        });
    }

    /**
     * Modify an advertisement.
     * @param adId The ID of the advertisement that you'd like to modify.
     * @param url The URL.
     * @param imageUrl The image.
     * @param options Options that you are able to change - Cardboard has set defaults for you.
     */
    public async setAdvertisement(
        adId: string,
        url: string,
        imageUrl: string,
        options: AdvertisementOptions,
    ): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/ad/update ", {
            id: adId,
            url,
            memo: options.memo || "",
            place: options.place || "horizontal",
            priority: options.priority || "middle",
            ratio: options.ratio || 1,
            expiresAt: options.expiresAt || Date.now() + 15778476000000, // 5 Years!
            startsAt: options.startsAt || Date.now(),
            imageUrl,
            dayOfWeek: options.dayOfWeek || 0,
        });
    }

    /**
     * Delete an Advertisement permanently from record.
     * @param advertisementId The advertisement you would like to have removed.
     */
    public async deleteAdvertisement(advertisementId: string): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/ad/delete", {
            id: advertisementId,
        });
    }

    /**
     * List reports.
     * @param sortingOptions A list of options you can utilize to sort.
     */
    public async getReports(
        sortingOptions?: ReportSortingOptions,
    ): Promise<IterableArray<Report>> {
        const report = await misskeyRequest(
            this.cardboard,
            "admin/abuse-user-reports",
            sortingOptions,
        );
        return new IterableArray(
            this.cardboard,
            "admin/abuse-user-reports",
            sortingOptions,
            report,
        );
    }

    /**
     * Resolve a report that was made within or sent to your instance.
     * @param reportId the id of the report you would like to report.
     * @param sendToRemoteInstance If the report was local, and about a remote user, send the report to the remote instance.
     */
    public async resolveReport(
        reportId: string,
        sendToRemoteInstance?: boolean,
    ): Promise<void> {
        await misskeyRequest(
            this.cardboard,
            "admin/resolve-abuse-user-report",
            {
                reportId,
                forward: sendToRemoteInstance,
            },
        );
    }

    /**
     * Get the immutable moderation logs.
     * @param options Optional methods of sorting the logs.
     * @returns {Promise<{id: string; createdAt: string; type: string; info: Record<string, unknown>; userId: string; user: MisskeyUser;}[]>}
     */
    public async getModerationLogs(options?: ModerationLogSorting): Promise<
        {
            id: string;
            createdAt: string;
            type: string;
            info: Record<string, unknown>;
            userId: string;
            user: User;
        }[]
    > {
        const returned = await misskeyRequest(
            this.cardboard,
            "admin/show-moderation-logs",
            options,
        );
        returned.user = new User(this.cardboard, returned.user);
        return new IterableArray(
            this.cardboard,
            "admin/show-moderation-logs",
            options,
            returned,
        );
    }
}
