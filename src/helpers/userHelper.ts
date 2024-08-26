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

/**
 * The User. Created by Cardboard.
 */
export class User {
    constructor(
        /**
         * The cardboard client, passed when creating a new user.
         * @see {CardboardClient}
         */
        protected readonly cardboard: CardboardClient,
        /**
         * The misskey user to extract from.
         * @see {MisskeyUser}
         */
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
    get name(): string | null {
        return this.misskeyUser.name;
    }

    /**
     * get the host of the user.
     * Will return null if it's the homeserver.
     */
    get host(): string | null {
        return this.misskeyUser.host;
    }

    /**
     * get the URL of the avatar.
     */
    get avatarUrl(): string | null {
        return this.misskeyUser.avatarUrl;
    }

    /**
     * Get the Hash used to create the blur for the user.
     */
    get avatarBlurhash(): string | null {
        return this.misskeyUser.avatarBlurhash;
    }

    /**
     * Quickly determine if the user has administrative abilities.
     */
    get isAdmin(): boolean | undefined {
        return this.misskeyUser.isAdmin;
    }

    /**
     * Quickly determine if a user can do moderation on a server.
     */
    get isModerator(): boolean | undefined {
        return this.misskeyUser.isModerator;
    }

    /**
     * Check and see if a user is silenced.
     */
    get isSilenced(): boolean {
        return this.misskeyUser.isSilenced;
    }

    /**
     * check and see if a user permits indexing or not.
     */
    get noindex(): boolean {
        return this.misskeyUser.noindex;
    }

    /**
     * check and see if the user is a bot.
     */
    get isBot(): boolean | undefined {
        return this.misskeyUser.isBot;
    }

    /**
     * see if the user is a cat (cat ears and cat speech is usually included.)
     */
    get isCat(): boolean | undefined {
        return this.misskeyUser.isCat;
    }

    /**
     * see if the user wishes to have their text transformed.
     */
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

    /**
     * Get the URL of the banner - commonly the image featured at the top of the profile
     */
    get bannerUrl(): string | null {
        return this.misskeyUser.bannerUrl;
    }

    /**
     * get the hash used to generate the blur for the banner, commonly used when the image cannot load.
     */
    get bannerBlurhash(): string | null {
        return this.misskeyUser.bannerBlurhash;
    }

    /**
     * get the background url - sharkey exclusive.
     */
    get backgroundUrl(): string | null {
        return this.misskeyUser.backgroundUrl;
    }

    /**
     * get the hash used to generate the blur for the background, commonly used when the image cannot load.
     */
    get backgroundBlurhash(): string | null {
        return this.misskeyUser.backgroundBlurhash;
    }

    get isLocked(): boolean {
        return this.misskeyUser.isLocked;
    }

    /**
     * See if the user is suspended.
     */
    get isSuspended(): boolean {
        return this.misskeyUser.isSuspended;
    }

    /**
     * A user-generated description.
     */
    get description(): string | null {
        return this.misskeyUser.description;
    }

    /**
     * The location, as set by the user.
     */
    get location(): string | null {
        return this.misskeyUser.location;
    }

    /**
     * Return the ListenBrainz username.
     */
    // biome-ignore lint/style/useNamingConvention: This is how it's spelt in the API.
    get ListenBrainz(): string | null {
        return this.misskeyUser.ListenBrainz;
    }

    /**
     * Get the language spoken by the user (set by the user.)
     */
    get lang(): string | null {
        return this.misskeyUser.lang;
    }

    /**
     * Get all fields.
     */
    get fields(): { name: string; value: string }[] {
        return this.misskeyUser.fields;
    }

    /**
     * Get links that have been verified by the user.
     */
    get verifiedLinks(): string[] {
        return this.misskeyUser.verifiedLinks;
    }

    /**
     * Get the number of followers a user has.
     * May possibly return with unexpected behavior.
     */
    get followersCount(): number {
        return this.misskeyUser.followersCount;
    }
    /**
     * Get the number of people a user follows.
     * May possibly return with unexpected behavior.
     */
    get followingCount(): number {
        return this.misskeyUser.followingCount;
    }

    /**
     * Get the number of notes the user creates.
     */
    get notesCount(): number {
        return this.misskeyUser.notesCount;
    }
    /**
     * get a list of pinned notes by ID only.
     */
    get pinnedNoteIds(): string[] {
        return this.misskeyUser.pinnedNoteIds;
    }

    /**
     * get a list of pinned notes.
     */
    get pinnedNotes(): Note[] {
        const notes: Note[] = [];
        for (const note of this.misskeyUser.pinnedNotes) {
            notes.push(new Note(this.cardboard, note));
        }
        return notes;
    }

    /**
     * get a list of pages by ID.
     */
    get pinnedPageId(): string[] {
        return this.pinnedPageId;
    }

    /**
     * See wether or not a user is publicly reacting.
     */
    get publicReactions(): boolean {
        return this.misskeyUser.publicReactions;
    }

    /**
     * see the visibility of whom a user is following
     */
    get followingVisibility(): "public" | "followers" | "private" {
        return this.misskeyUser.followingVisibility;
    }
    /**
     * check the visibility of the followers a user has
     */
    get followersVisibility(): "public" | "followers" | "private" {
        return this.misskeyUser.followersVisibility;
    }

    /**
     * see the personally set memo
     */
    get memo(): string | null {
        return this.misskeyUser.memo;
    }

    /**
     * see the moderation note (if account has it.)
     */
    get moderationNote(): string | null | undefined {
        return this.misskeyUser.moderationNote;
    }

    /**
     * see if the user is being followed by you.
     */
    get isFollowing(): boolean | undefined {
        return this.misskeyUser.isFollowing;
    }

    /**
     * see if the user is following you.
     */
    get isFollowed(): boolean | undefined {
        return this.misskeyUser.isFollowed;
    }

    /**
     * See if there's a pending follow request from you.
     */
    get hasPendingFollowRequestFromYou(): boolean | undefined {
        return this.misskeyUser.hasPendingFollowRequestFromYou;
    }

    /**
     * See if you have a pending follow request.
     */
    get hasPendingFollowRequestToYou(): boolean | undefined {
        return this.misskeyUser.hasPendingFollowRequestToYou;
    }

    /**
     * See if you're blocking the user.
     */
    get isBlocking(): boolean | undefined {
        return this.misskeyUser.isBlocking;
    }

    /**
     * See if the user is blocking you.
     */
    get isBlocked(): boolean | undefined {
        return this.misskeyUser.isBlocked;
    }

    /**
     * See if the user is muted by you.
     */
    get isMuted(): boolean | undefined {
        return this.misskeyUser.isMuted;
    }
    /**
     * See if you've muted renotes from that user.
     */
    get isRenoteMuted(): boolean | undefined {
        return this.misskeyUser.isRenoteMuted;
    }

    get notify(): "normal" | "none" | undefined {
        return this.misskeyUser.notify;
    }

    get withReplies(): boolean | undefined {
        return this.misskeyUser.withReplies;
    }

    /**
     * See when the user was created or discovered by the server.
     */
    get createdAt(): Date {
        return new Date(this.misskeyUser.createdAt);
    }

    /**
     * See when the user was last updated at.
     */
    get updatedAt(): Date | null {
        if (typeof this.misskeyUser.updatedAt === "string") {
            return new Date(this.misskeyUser.updatedAt);
        }
        return this.misskeyUser.updatedAt;
    }

    /**
     * See when the user was last fetched at.
     */
    get lastFetchedAt(): Date | null {
        if (typeof this.misskeyUser.lastFetchedAt === "string") {
            return new Date(this.misskeyUser.lastFetchedAt);
        }
        return this.misskeyUser.lastFetchedAt;
    }

    /**
     * Get the birthday of the user.
     */
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
     * Suspends the user from using the instance.
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
