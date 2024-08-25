import type { CardboardClient } from "..";
import { type NoteOptions, NoteVisibility } from "../types/note";
import type { MisskeyUser } from "../types/user";
import { CannotHurtSelfError, NoBotInteractionError } from "./error";
import { Note } from "./noteHelper";
import { misskeyRequest } from "./requestHelper";

const checkForHarmAndThrowIfTrue = async (
    cardboard: CardboardClient,
    userId: string,
) => {
    const checkforSelf = await misskeyRequest(cardboard, "i");
    if (checkforSelf.id === userId) {
        throw new CannotHurtSelfError();
    }
};

const checkForNoBotAndThrowIfExists = (
    cardboard: CardboardClient,
    user: MisskeyUser,
) => {
    if (
        cardboard.options?.bypassNoBot &&
        user.description.toLocaleLowerCase().includes("#nobot")
    ) {
        console.warn(`
====
user @${user.username}${user.instance ? `@${user.instance}` : ""} does NOT want to be interacted with.
However, #NoBot Interaction Errors are being bypassed.
To disable this warning, please disable bypassNoBot.
====`);
    }
    if (user.description.toLocaleLowerCase().includes("#nobot")) {
        throw new NoBotInteractionError();
    }
    return Promise.resolve(true);
};

export class User {
    constructor(
        protected readonly cardboard: CardboardClient,
        protected misskeyUser: MisskeyUser,
    ) {}

    /**
     * Return the ID of the user.
     */
    get id(): string {
        return this.misskeyUser.id;
    }
    /**
     * Get the displayname of the user
     */
    get name(): string {
        return this.misskeyUser.name;
    }

    get host(): string | null {
        return this.misskeyUser.host;
    }

    get avatarUrl(): string | null {
        return this.misskeyUser.avatarUrl;
    }

    get avatarBlurhash(): string | null {
        return this.misskeyUser.avatarBlurhash;
    }

    get isAdmin(): boolean | undefined {
        return this.misskeyUser.isAdmin;
    }

    get isModerator(): boolean | undefined {
        return this.misskeyUser.isModerator;
    }

    get isSilenced(): boolean {
        return this.misskeyUser.isSilenced;
    }

    get noindex(): boolean {
        return this.misskeyUser.noindex;
    }

    get isBot(): boolean | undefined {
        return this.misskeyUser.isBot;
    }

    get isCat(): boolean | undefined {
        return this.misskeyUser.isCat;
    }

    get speakAsCat(): boolean | undefined {
        return this.misskeyUser.speakAsCat;
    }

    get url(): string | null {
        return this.misskeyUser.url;
    }

    get uri(): string | null {
        return this.misskeyUser.uri;
    }

    get movedTo(): string | null {
        return this.misskeyUser.movedTo;
    }

    get alsoKnownAs(): string[] | null {
        return this.misskeyUser.alsoKnownAs;
    }

    get bannerUrl(): string | null {
        return this.misskeyUser.bannerUrl;
    }

    get bannerBlurhash(): string | null {
        return this.misskeyUser.bannerBlurhash;
    }

    get backgroundUrl(): string | null {
        return this.misskeyUser.backgroundUrl;
    }

    get backgroundBlurhash(): string | null {
        return this.misskeyUser.backgroundBlurhash;
    }

    get isLocked(): boolean {
        return this.misskeyUser.isLocked;
    }

    get isSuspended(): boolean {
        return this.misskeyUser.isSuspended;
    }

    get description(): string | null {
        return this.misskeyUser.description;
    }

    get location(): string | null {
        return this.misskeyUser.location;
    }

    // biome-ignore lint/style/useNamingConvention: This is how it's spelt in the API.
    get ListenBrainz(): string | null {
        return this.misskeyUser.ListenBrainz;
    }

    get lang(): string | null {
        return this.misskeyUser.lang;
    }

    get fields(): { name: string; value: string }[] {
        return this.misskeyUser.fields;
    }

    get verifiedLinks(): string[] {
        return this.misskeyUser.verifiedLinks;
    }

    get followersCount(): number {
        return this.misskeyUser.followersCount;
    }

    get followingCount(): number {
        return this.misskeyUser.followingCount;
    }

    get notesCount(): number {
        return this.misskeyUser.notesCount;
    }
    get pinnedNoteIds(): string[] {
        return this.misskeyUser.pinnedNoteIds;
    }

    get pinnedNotes(): Note[] {
        const notes: Note[] = [];
        for (const note of this.misskeyUser.pinnedNotes) {
            notes.push(new Note(this.cardboard, note));
        }
        return notes;
    }

    get pinnedPageId(): string[] {
        return this.pinnedPageId;
    }

    get publicReactions(): boolean {
        return this.misskeyUser.puiblicReactions;
    }

    get followingVisibility(): "public" | "followers" | "private" {
        return this.misskeyUser.followingVisibility;
    }
    get followersVisibility(): "public" | "followers" | "private" {
        return this.misskeyUser.followersVisibility;
    }

    get memo(): string | null {
        return this.misskeyUser.memo;
    }

    get moderationNote(): string | null | undefined {
        return this.misskeyUser.moderationNote;
    }

    get isFollowing(): boolean | undefined {
        return this.misskeyUser.isFollowing;
    }

    get isFollowed(): boolean | undefined {
        return this.misskeyUser.isFollowed;
    }

    get hasPendingFollowRequestFromYou(): boolean | undefined {
        return this.misskeyUser.hasPendingFollowRequestFromYou;
    }

    get hasPendingFollowRequestToYou(): boolean | undefined {
        return this.misskeyUser.hasPendingFollowRequestToYou;
    }

    get isBlocking(): boolean | undefined {
        return this.misskeyUser.isBlocking;
    }

    get isBlocked(): boolean | undefined {
        return this.misskeyUser.isBlocked;
    }

    get isMuted(): boolean | undefined {
        return this.misskeyUser.isMuted;
    }

    get isRenoteMuted(): boolean | undefined {
        return this.misskeyUser.isRenoteMuted;
    }

    get notify(): "normal" | "none" | undefined {
        return this.misskeyUser.notify;
    }

    get withReplies(): boolean | undefined {
        return this.misskeyUser.withReplies;
    }

    get createdAt(): Date {
        return new Date(this.misskeyUser.createdAt);
    }

    get updatedAt(): Date | null {
        if (typeof this.misskeyUser.updatedAt === "string") {
            return new Date(this.misskeyUser.updatedAt);
        }
        return this.misskeyUser.updatedAt;
    }

    get lastFetchedAt(): Date | null {
        if (typeof this.misskeyUser.lastFetchedAt === "string") {
            return new Date(this.misskeyUser.lastFetchedAt);
        }
        return this.misskeyUser.lastFetchedAt;
    }

    get birthday(): Date | null | undefined {
        if (typeof this.misskeyUser.birthday === "string") {
            return new Date(this.misskeyUser.birthday);
        }
        return this.misskeyUser.birthday;
    }

    /**
     * Raw access to the misskey user.
     * @deprecated
     */
    get user(): MisskeyUser {
        return this.misskeyUser;
    }

    /**
     * Suspends the user from using the isntance.
     * @param modNote an optional string to automatically inform admins what's going on.
     */
    async suspend(modNote?: string): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/suspend-user", {
            userId: this.user.id,
        });
        if (modNote) {
            await misskeyRequest(this.cardboard, "admin/update-user-note", {
                userId: this.user.id,
                text: `${this.user.moderationNote}\n${modNote}`,
            });
        }
    }

    /**
     * Add a modnote to the profile. Will fail if you do not have permission.
     * Might be baked into the function you're running already; keep in mind!
     * @param modNote The modnote you would like to add in.
     */
    async setModNote(modNote: string): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/update-user-note", {
            userId: this.user.id,
            text: modNote,
        });
    }

    /**
     * Set all content from a user as NSFW, instance wide.
     * @param nsfw whether or not you wish for the user to be nsfw'd.
     */
    async setNsfw(nsfw: boolean): Promise<void> {
        await misskeyRequest(
            this.cardboard,
            nsfw ? "admin/nsfw-user" : "admin/unnsfw-user",
            {
                userId: this.user.id,
            },
        );
    }

    /**
     * Accept a pending follow request.
     */
    async approveFollowRequest(): Promise<void> {
        await misskeyRequest(this.cardboard, "following/requests/accept", {
            userId: this.user.id,
        });
    }
    /**
     * Reject a follow request that is pending for the user.
     */
    async rejectFollowRequest(): Promise<void> {
        await misskeyRequest(this.cardboard, "following/requests/reject", {
            userId: this.user.id,
        });
    }

    /**
     * Unsuspend the user from the instance, allowing them to access it again.
     * @param modNote an optional string to automatically inform admins what's going on.
     */
    async unsuspend(modNote?: string): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/unsuspend-user", {
            userId: this.user.id,
        });
        if (modNote) {
            await misskeyRequest(this.cardboard, "admin/update-user-note", {
                userId: this.user.id,
                text: `${this.user.moderationNote}\n${modNote}`,
            });
        }
    }

    /**
     * silence the user, preventing their notes from appearing on feeds unless they're followed.
     * @param modNote an optional string to automatically inform admins what's going on.
     */
    async silence(modNote?: string): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/silence-user", {
            userId: this.user.id,
        });
        if (modNote) {
            await misskeyRequest(this.cardboard, "admin/update-user-note", {
                userId: this.user.id,
                text: `${this.user.moderationNote}\n${modNote}`,
            });
        }
    }

    /**
     * unsilence their user, bringing their post visibility back to normal.
     * @param modNote an optional string to automatically inform admins what's going on.
     */
    async unsilence(modNote?: string): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/unsilence-user", {
            userId: this.user.id,
        });
        if (modNote) {
            await misskeyRequest(this.cardboard, "admin/update-user-note", {
                userId: this.user.id,
                text: `${this.user.moderationNote}\n${modNote}`,
            });
        }
    }

    /**
     * follow the user.
     */
    async follow(): Promise<void> {
        await checkForHarmAndThrowIfTrue(this.cardboard, this.user.id);
        await checkForNoBotAndThrowIfExists(this.cardboard, this.user);
        const request = await misskeyRequest(
            this.cardboard,
            "following/create",
            { userId: this.user.id },
        );
        this.misskeyUser = request;
    }

    /**
     * unfollow the user.
     */
    async unfollow(): Promise<void> {
        await checkForHarmAndThrowIfTrue(this.cardboard, this.user.id);
        const request = await misskeyRequest(
            this.cardboard,
            "following/delete",
            { userId: this.user.id },
        );
        this.misskeyUser = request;
    }

    /**
     * mute the user, preventing it from being seen by the bot.
     * @param renotes prevent notes from this user, renoted by others, from appearing on the feed.
     */
    async mute(renotes = false): Promise<void> {
        await checkForHarmAndThrowIfTrue(this.cardboard, this.user.id);
        const request = await misskeyRequest(this.cardboard, "mute/create", {
            userId: this.user.id,
        });
        this.misskeyUser = request;
        if (renotes) {
            await misskeyRequest(this.cardboard, "renote-mute/create", {
                userId: this.user.id,
            });
        }
    }

    /**
     * unmute the user, restoring vision of this user's notes to the bot.
     * @param renotes also return notes from this user, renoted by others.
     */
    async unmute(renotes = false): Promise<void> {
        await checkForHarmAndThrowIfTrue(this.cardboard, this.user.id);
        const request = await misskeyRequest(this.cardboard, "mute/delete", {
            userId: this.user.id,
        });
        this.misskeyUser = request;
        if (renotes) {
            await misskeyRequest(this.cardboard, "renote-mute/delete", {
                userId: this.user.id,
            });
        }
    }

    /**
     * Block the user, preventing the user from seeing the bot, & vice versa.
     * On specific/legacy instances, you should keep in mind that some users may be able to bypass this,
     * and that the bot is easily accessible by viewing it from a seperate account, or by logging out.
     */
    async block(): Promise<void> {
        await checkForHarmAndThrowIfTrue(this.cardboard, this.user.id);

        const request = await misskeyRequest(
            this.cardboard,
            "blocking/create",
            {
                userId: this.user.id,
            },
        );
        this.misskeyUser = request;
    }

    /**
     * Block the user, preventing the user from seeing the bot, & vice versa.
     * On specific/legacy instances, you should keep in mind that some users may be able to bypass this,
     * and that the bot is easily accessible by viewing it from a seperate account, or by logging out.
     */
    async unblock(): Promise<void> {
        await checkForHarmAndThrowIfTrue(this.cardboard, this.user.id);
        const request = await misskeyRequest(
            this.cardboard,
            "blocking/delete",
            { userId: this.user.id },
        );
        this.misskeyUser = request;
    }

    /**
     * Set a memo on the profile.
     * @param memo a text string. Newlines can use `\n`.
     */
    async setMemo(memo: string): Promise<void> {
        await misskeyRequest(this.cardboard, "users/update-memo", {
            userId: this.user.id,
            memo: memo,
        });
    }

    /**
     * Alias for creating a specified note for a user.
     * @param content The message you wish to send.
     * @param options The message options. Some are disabled.
     * @returns {Promise<Note>}
     */
    async dm(
        content: string,
        options?: Omit<NoteOptions, "text" | "visibility" | "visibleUserIds">,
    ): Promise<Note> {
        await checkForNoBotAndThrowIfExists(this.cardboard, this.user);
        return await this.cardboard.createNote(content, {
            visibility: NoteVisibility.Specified,
            text: content,
            visibleUserIds: [this.user.id],
            ...options,
        });
    }
}
