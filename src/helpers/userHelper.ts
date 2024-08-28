import type { CardboardClient } from "..";
import { type NoteOptions, NoteVisibility } from "../types/note";
import type {
    Decoration,
    MisskeyLiteUser,
    MisskeyUser,
    MisskeyRole,
    UserAdminMeta,
} from "../types/user";
import { CannotHurtSelfError, NoBotInteractionError } from "./error";
import { Note } from "./noteHelper";
import { misskeyRequest } from "./requestHelper";

const checkForHarmAndThrowIfTrue = async (
    cardboard: CardboardClient,
    userId: string,
) => {
    const checkForSelf = await misskeyRequest(cardboard, "i");
    if (checkForSelf.id === userId) {
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
 * A stripped down User that is meant strictly for approval or rejection; since the rest of the user can be assumed to be default.
 */
export class ApprovableUser {
    constructor(
        protected readonly cardboard: CardboardClient,
        private readonly user: MisskeyUser,
        private readonly userMeta: UserAdminMeta,
    ) {}
    get username(): string {
        return this.user.username;
    }
    get id(): string {
        return this.user.id;
    }
    get email(): string {
        return this.userMeta.email;
    }
    get approvalReason(): string {
        return this.userMeta.signupReason;
    }
    async approve(): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/approve-user", {
            userId: this.user.id,
        });
    }
    async reject(): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/delete-account", {
            userId: this.user.id,
        });
    }
}

/**
 * The LiteUser. A stripped down user to make transmission a bit easier.
 */
export class LiteUser {
    constructor(
        protected readonly cardboard: CardboardClient,
        protected readonly misskeyUser: MisskeyLiteUser | MisskeyUser,
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
    get displayName(): string | null {
        return this.misskeyUser.name;
    }

    get username(): string {
        return this.misskeyUser.username;
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

    get avatarDecorations(): Decoration[] {
        return this.misskeyUser.avatarDecorations;
    }

    get isAdmin(): boolean {
        if (this.misskeyUser.isAdmin === undefined) {
            return false;
        }
        return this.misskeyUser.isAdmin;
    }

    get isModerator(): boolean {
        if (this.misskeyUser.isModerator === undefined) {
            return false;
        }
        return this.misskeyUser.isModerator;
    }

    get isSilenced(): boolean {
        return this.misskeyUser.isSilenced;
    }

    /**
     * The noindex accessor is kept strictly for compatibility.
     * You're better off using isIndexable.
     * @deprecated
     */
    get noindex(): boolean {
        return this.misskeyUser.noindex;
    }

    get isIndexable(): boolean {
        return !this.misskeyUser.noindex;
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
    get emojis(): Record<string, string> | undefined {
        return this.misskeyUser.emojis;
    }

    get onlineStatus(): string | undefined {
        return this.misskeyUser.onlineStatus;
    }

    get badgeRoles(): Array<{
        name: string;
        iconUrl: string | null;
        displayOrder: number;
    }> {
        return this.misskeyUser.badgeRoles;
    }

    async getFullUser?() {
        await misskeyRequest(this.cardboard, "users/show", { userId: this.id });
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
                userId: this.id,
            },
        );
    }

    /**
     * Accept a pending follow request.
     */
    async approveFollowRequest(): Promise<void> {
        await misskeyRequest(this.cardboard, "following/requests/accept", {
            userId: this.id,
        });
    }
    /**
     * Reject a follow request that is pending for the user.
     */
    async rejectFollowRequest(): Promise<void> {
        await misskeyRequest(this.cardboard, "following/requests/reject", {
            userId: this.id,
        });
    }

    /**
     * unfollow the user.
     */
    async unfollow(): Promise<void> {
        await checkForHarmAndThrowIfTrue(this.cardboard, this.id);
        await misskeyRequest(this.cardboard, "following/delete", {
            userId: this.id,
        });
    }

    /**
     * mute the user, preventing it from being seen by the bot.
     * @param renotes prevent notes from this user, renoted by others, from appearing on the feed.
     */
    async mute(renotes = false): Promise<void> {
        await checkForHarmAndThrowIfTrue(this.cardboard, this.id);
        await misskeyRequest(this.cardboard, "mute/create", {
            userId: this.id,
        });
        if (renotes) {
            await misskeyRequest(this.cardboard, "renote-mute/create", {
                userId: this.id,
            });
        }
    }

    /**
     * unmute the user, restoring vision of this user's notes to the bot.
     * @param renotes also return notes from this user, renoted by others.
     */
    async unmute(renotes = false): Promise<void> {
        await checkForHarmAndThrowIfTrue(this.cardboard, this.id);
        await misskeyRequest(this.cardboard, "mute/delete", {
            userId: this.id,
        });
        if (renotes) {
            await misskeyRequest(this.cardboard, "renote-mute/delete", {
                userId: this.id,
            });
        }
    }

    /**
     * Block the user, preventing the user from seeing the bot.
     * On specific/legacy instances, you should keep in mind that some users may be able to bypass this,
     * and that the bot is easily accessible by viewing it from a separate account, or by logging out.
     */
    async block(): Promise<void> {
        await checkForHarmAndThrowIfTrue(this.cardboard, this.id);
        await misskeyRequest(this.cardboard, "blocking/create", {
            userId: this.id,
        });
    }

    /**
     * Unblock the user, Allowing the user to see the bot.
     * On specific/legacy instances, you should keep in mind that some users may be able to bypass this,
     * and that the bot is easily accessible by viewing it from a separate account, or by logging out.
     */
    async unblock(): Promise<void> {
        await checkForHarmAndThrowIfTrue(this.cardboard, this.id);
        await misskeyRequest(this.cardboard, "blocking/delete", {
            userId: this.id,
        });
    }

    /**
     * Set a memo on the profile.
     * @param memo a text string. Newlines can use `\n`.
     */
    async setMemo(memo: string): Promise<void> {
        await misskeyRequest(this.cardboard, "users/update-memo", {
            userId: this.id,
            memo: memo,
        });
    }
}

/**
 * The User. Created by Cardboard.
 */
export class User extends LiteUser {
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
        protected fullMisskeyUser: MisskeyUser,
    ) {
        super(cardboard, fullMisskeyUser);
        this.getFullUser = undefined;
    }
    /**
     * Get the URL of the user, if they're not on the homeserver.
     */
    get url(): string | null {
        return this.fullMisskeyUser.url;
    }

    /**
     * Get the JSON-encoded property of the user, if they're not on the homeserver.
     */
    get uri(): string | null {
        return this.fullMisskeyUser.uri;
    }

    /**
     * Get the URL of the new account the user has moved to.
     */
    get movedTo(): string | null {
        return this.fullMisskeyUser.movedTo;
    }

    /**
     * Get the accounts of who the user previously was.
     */
    get alsoKnownAs(): string[] | null {
        return this.fullMisskeyUser.alsoKnownAs;
    }

    /**
     * Get the URL of the banner - commonly the image featured at the top of the profile
     */
    get bannerUrl(): string | null {
        return this.fullMisskeyUser.bannerUrl;
    }

    /**
     * get the hash used to generate the blur for the banner, commonly used when the image cannot load.
     */
    get bannerBlurhash(): string | null {
        return this.fullMisskeyUser.bannerBlurhash;
    }

    /**
     * get the background url - sharkey exclusive.
     */
    get backgroundUrl(): string | null {
        return this.fullMisskeyUser.backgroundUrl;
    }

    /**
     * get the hash used to generate the blur for the background, commonly used when the image cannot load.
     */
    get backgroundBlurhash(): string | null {
        return this.fullMisskeyUser.backgroundBlurhash;
    }

    /**
     * {unknown}
     */
    get isLocked(): boolean {
        return this.fullMisskeyUser.isLocked;
    }

    /**
     * See if the user is suspended.
     */
    get isSuspended(): boolean {
        return this.fullMisskeyUser.isSuspended;
    }

    /**
     * A user-generated description.
     */
    get description(): string | null {
        return this.fullMisskeyUser.description;
    }

    /**
     * The location, as set by the user.
     */
    get location(): string | null {
        return this.fullMisskeyUser.location;
    }

    /**
     * The username, chosen by the user. cannot change.
     */
    get username(): string {
        return this.fullMisskeyUser.username;
    }

    /**
     * Return the ListenBrainz username.
     */
    // biome-ignore lint/style/useNamingConvention: This is how it's spelt in the API.
    get ListenBrainz(): string | null {
        return this.fullMisskeyUser.ListenBrainz;
    }

    /**
     * Get the language spoken by the user (set by the user.)
     */
    get lang(): string | null {
        return this.fullMisskeyUser.lang;
    }

    /**
     * Get all fields.
     */
    get fields(): /**
     * fields that were self-set by the user.
     */
    MisskeyUser["fields"] {
        return this.fullMisskeyUser.fields;
    }

    /**
     * Get links that have been verified by the user.
     */
    get verifiedLinks(): string[] {
        return this.fullMisskeyUser.verifiedLinks;
    }

    /**
     * Get the number of followers a user has.
     * May possibly return with unexpected behavior.
     */
    get followersCount(): number {
        return this.fullMisskeyUser.followersCount;
    }
    /**
     * Get the number of people a user follows.
     * May possibly return with unexpected behavior.
     */
    get followingCount(): number {
        return this.fullMisskeyUser.followingCount;
    }

    /**
     * Get the number of notes the user creates.
     */
    get notesCount(): number {
        return this.fullMisskeyUser.notesCount;
    }
    /**
     * get a list of pinned notes by ID only.
     */
    get pinnedNoteIds(): string[] {
        return this.fullMisskeyUser.pinnedNoteIds;
    }

    /**
     * get a list of pinned notes.
     */
    get pinnedNotes(): Note[] {
        const notes: Note[] = [];
        for (const note of this.fullMisskeyUser.pinnedNotes) {
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
        return this.fullMisskeyUser.publicReactions;
    }

    /**
     * see the visibility of whom a user is following
     */
    get followingVisibility(): "public" | "followers" | "private" {
        return this.fullMisskeyUser.followingVisibility;
    }
    /**
     * check the visibility of the followers a user has
     */
    get followersVisibility(): "public" | "followers" | "private" {
        return this.fullMisskeyUser.followersVisibility;
    }

    /**
     * see the personally set memo
     */
    get memo(): string | null {
        return this.fullMisskeyUser.memo;
    }

    /**
     * see the moderation note (if account has it.)
     */
    get moderationNote(): string | null | undefined {
        return this.fullMisskeyUser.moderationNote;
    }

    /**
     * see if the user is being followed by you.
     */
    get isFollowing(): boolean | undefined {
        return this.fullMisskeyUser.isFollowing;
    }

    /**
     * see if the user is following you.
     */
    get isFollowed(): boolean | undefined {
        return this.fullMisskeyUser.isFollowed;
    }

    /**
     * See if there's a pending follow request from you.
     */
    get hasPendingFollowRequestFromYou(): boolean | undefined {
        return this.fullMisskeyUser.hasPendingFollowRequestFromYou;
    }

    /**
     * See if you have a pending follow request.
     */
    get hasPendingFollowRequestToYou(): boolean | undefined {
        return this.fullMisskeyUser.hasPendingFollowRequestToYou;
    }

    /**
     * See if you're blocking the user.
     */
    get isBlocking(): boolean | undefined {
        return this.fullMisskeyUser.isBlocking;
    }

    /**
     * See if the user is blocking you.
     */
    get isBlocked(): boolean | undefined {
        return this.fullMisskeyUser.isBlocked;
    }

    /**
     * See if the user is muted by you.
     */
    get isMuted(): boolean | undefined {
        return this.fullMisskeyUser.isMuted;
    }
    /**
     * See if you've muted renotes from that user.
     */
    get isRenoteMuted(): boolean | undefined {
        return this.fullMisskeyUser.isRenoteMuted;
    }

    /**
     * {unknown}
     */
    get notify(): "normal" | "none" | undefined {
        return this.fullMisskeyUser.notify;
    }

    /**
     * {unknown}
     */
    get withReplies(): boolean | undefined {
        return this.fullMisskeyUser.withReplies;
    }

    /**
     * See when the user was created or discovered by the server.
     */
    get createdAt(): Date {
        return new Date(this.fullMisskeyUser.createdAt);
    }

    /**
     * See when the user was last updated at.
     */
    get updatedAt(): Date | null {
        if (typeof this.fullMisskeyUser.updatedAt === "string") {
            return new Date(this.fullMisskeyUser.updatedAt);
        }
        return this.fullMisskeyUser.updatedAt;
    }

    /**
     * See when the user was last fetched at.
     */
    get lastFetchedAt(): Date | null {
        if (typeof this.fullMisskeyUser.lastFetchedAt === "string") {
            return new Date(this.fullMisskeyUser.lastFetchedAt);
        }
        return this.fullMisskeyUser.lastFetchedAt;
    }

    get roles(): MisskeyRole[] {
        return this.fullMisskeyUser.roles;
    }

    /**
     * Get the birthday of the user.
     */
    get birthday(): Date | null | undefined {
        if (typeof this.fullMisskeyUser.birthday === "string") {
            return new Date(this.fullMisskeyUser.birthday);
        }
        return this.fullMisskeyUser.birthday;
    }

    /**
     * Raw access to the misskey user.
     * @deprecated
     */
    get user(): MisskeyUser {
        return this.fullMisskeyUser;
    }

    /**
     * Unsuspend the user from the instance, allowing them to access it again.
     * @param modNote an optional string to automatically inform admins what's going on.
     */
    async unsuspend(modNote?: string): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/unsuspend-user", {
            userId: this.id,
        });
        if (modNote) {
            await misskeyRequest(this.cardboard, "admin/update-user-note", {
                userId: this.id,
                text: `${this.moderationNote}\n${modNote}`,
            });
        }
    }

    /**
     * silence the user, preventing their notes from appearing on feeds unless they're followed.
     * @param modNote an optional string to automatically inform admins what's going on.
     */
    async silence(modNote?: string): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/silence-user", {
            userId: this.id,
        });
        if (modNote) {
            await misskeyRequest(this.cardboard, "admin/update-user-note", {
                userId: this.id,
                text: `${this.moderationNote}\n${modNote}`,
            });
        }
    }

    /**
     * unsilence their user, bringing their post visibility back to normal.
     * @param modNote an optional string to automatically inform admins what's going on.
     */
    async unsilence(modNote?: string): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/unsilence-user", {
            userId: this.id,
        });
        if (modNote) {
            await misskeyRequest(this.cardboard, "admin/update-user-note", {
                userId: this.id,
                text: `${this.moderationNote}\n${modNote}`,
            });
        }
    }

    /**
     * Suspends the user from using the instance.
     * @param modNote an optional string to automatically inform admins what's going on.
     */
    async suspend(modNote?: string): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/suspend-user", {
            userId: this.id,
        });
        if (modNote) {
            await misskeyRequest(this.cardboard, "admin/update-user-note", {
                userId: this.id,
                text: `${this.moderationNote}\n${modNote}`,
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
            userId: this.id,
            text: modNote,
        });
    }

    /**
     * follow the user.
     */
    async follow(): Promise<void> {
        await checkForHarmAndThrowIfTrue(this.cardboard, this.id);
        await checkForNoBotAndThrowIfExists(
            this.cardboard,
            this.fullMisskeyUser,
        );
        await misskeyRequest(this.cardboard, "following/create", {
            userId: this.id,
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
        await checkForNoBotAndThrowIfExists(
            this.cardboard,
            this.fullMisskeyUser,
        );
        return await this.cardboard.createNote(content, {
            visibility: NoteVisibility.Specified,
            text: content,
            visibleUserIds: [this.id],
            ...options,
        });
    }
}
