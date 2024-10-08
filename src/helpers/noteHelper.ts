import type { CardboardClient } from "../index";
import type {
    MisskeyNote,
    NoteOptions,
    NoteVisibility,
    ReactionAcceptance,
} from "../types/note";
import { NotImplementedError } from "./error";
import { FileItem } from "./fileHelper";
// import { IterableArray } from "./iterableArrayHelper";
import { misskeyRequest } from "./requestHelper";
import { LiteUser } from "./userHelper";

/**
 * A wrapped note, created by cardboard.
 */
export class Note {
    constructor(
        /**
         * Cardboard! How strange!
         */
        private readonly cardboard: CardboardClient,
        /**
         * @deprecated
         */
        public readonly note: MisskeyNote,
    ) {
        this.content = note.text;
    }

    /**
     * @deprecated for capability.
     */
    get text(): string | null {
        return this.note.text;
    }

    get createdAt(): Date {
        return new Date(this.note.createdAt);
    }

    get deletedAt(): Date | null {
        if (!this.note.deletedAt) {
            return null;
        }
        return new Date(this.note.deletedAt);
    }

    get cw(): string | null | undefined {
        if (!this.note.cw) {
            return null;
        }
        return this.note.cw;
    }

    get userId(): string {
        return this.note.userId;
    }

    get replyId(): string | null {
        if (!this.note.replyId) {
            return null;
        }
        return this.note.replyId;
    }

    get renoteId(): string | null {
        if (!this.note.renoteId) {
            return null;
        }
        return this.note.renoteId;
    }

    get parent(): Note | null {
        if (!this.note.reply) {
            return null;
        }
        return new Note(this.cardboard, this.note.reply);
    }

    get linkedNote(): Note | null {
        if (!this.note.renote) {
            return null;
        }
        return new Note(this.cardboard, this.note.renote);
    }

    get isHidden(): boolean {
        if (!this.note.isHidden) {
            return false;
        }
        return this.note.isHidden;
    }

    get visibility(): NoteVisibility {
        return this.note.visibility;
    }

    get mentions(): string[] {
        if (!this.note.mentions) {
            return [];
        }
        return this.note.mentions;
    }

    get visibleUserIds(): string[] {
        if (!this.note.visibleUserIds) {
            return [];
        }
        return this.note.visibleUserIds;
    }

    get files(): FileItem[] {
        if (!this.note.files) {
            return [];
        }
        const fileArray: FileItem[] = [];
        for (const file of this.note.files) {
            fileArray.push(new FileItem(this.cardboard, file));
        }
        return fileArray;
    }

    get tags(): string[] {
        if (!this.note.tags) {
            return [];
        }
        return this.note.tags;
    }

    get poll(): NotImplementedError {
        throw NotImplementedError;
    }

    get emojis(): NotImplementedError {
        throw NotImplementedError;
    }

    get channelId(): string | null {
        if (!this.note.channelId) {
            return null;
        }
        return this.note.channelId;
    }

    get channel(): NotImplementedError {
        throw NotImplementedError;
    }

    get localOnly(): boolean {
        if (!this.note.localOnly) {
            return false;
        }
        return this.note.localOnly;
    }

    get reactionAcceptance(): ReactionAcceptance | null {
        return this.note.reactionAcceptance;
    }

    get reactionEmojis(): unknown {
        return this.note.emojis;
    }

    get reactions(): unknown {
        return this.note.reactions;
    }

    get reactionCount(): number {
        return this.note.reactionCount;
    }

    get renoteCount(): number {
        return this.note.renoteCount;
    }

    get repliesCount(): number {
        return this.note.repliesCount;
    }

    get url(): string | undefined {
        return this.note.url;
    }

    get uri(): string | undefined {
        return this.note.uri;
    }

    get reactionAndUserPairCache(): string[] {
        if (!this.note.reactionAndUserPairCache) {
            return [];
        }
        return this.note.reactionAndUserPairCache;
    }

    get clippedCount(): number | null {
        if (!this.note.clippedCount) {
            return null;
        }
        return this.note.clippedCount;
    }

    get myReaction(): string | null {
        if (!this.note.myReaction) {
            return null;
        }
        return this.note.myReaction;
    }

    /**
     * The content of the note.
     */
    public content: string | null;

    /**
     * The user who made the post.
     */
    get user(): LiteUser {
        return new LiteUser(this.cardboard, this.note.user);
    }

    /**
     * Get the ID of the note.
     */
    get id(): string {
        return this.note.id;
    }

    /**
     * get the Parent note, if there is any.
     * @returns {Promise<Note|null>}
     */
    async getParent(): Promise<Note | null> {
        if (this.note.reply) {
            return new Note(this.cardboard, this.note.reply);
        }
        if (this.note.replyId) {
            return new Note(
                this.cardboard,
                await misskeyRequest(this.cardboard, "notes/show", {
                    noteId: this.note.replyId,
                }),
            );
        }
        return null;
    }

    /**
     * Get Replies (Children) of the note you have.
     * @param options options to get more children, or change which children are seen.
     * @returns {Promise<Note[] | null>}
     * @todo add proper and easy pagination.
     */
    async getReplies(options: {
        limit: number;
        sinceId: string;
        untilId: string;
        showQuotes: boolean;
    }): Promise<Note[] | null> {
        if (this.note.repliesCount !== 0) {
            const notes = await misskeyRequest(
                this.cardboard,
                "notes/children",
                { noteId: this.note.id, ...options },
            );
            const preppedNotes: Note[] = [];
            for await (const reply of notes) {
                preppedNotes.push(new Note(this.cardboard, reply));
            }
            return preppedNotes;
            // return new IterableArray(
            //     this.cardboard,
            //     "notes/children",
            //     options,
            //     preppedNotes,
            // );
        }
        return null;
    }

    /**
     * Reply to this post.
     * @param {string} content - The message you would like to send.
     * @param {NoteOptions} options - optional settings to modify to whom and how your message is sent.
     * @returns {Promise<Note>}
     */
    async reply(
        content: string,
        options?: Omit<NoteOptions, "replyId" | "renoteId" | "channelId">,
    ): Promise<Note> {
        return await this.cardboard.createNote(content, {
            replyId: this.note.id,
            visibility: this.note.visibility,
            text: content,
            ...options,
        });
    }

    //TODO: Get unicode emojis. Right now, I'm just not that good... =~=
    /**
     * Get all *custom* emojis within a post.
     * This function does not get unicode emojis yet.
     */
    getEmojis(): Record<string, number> | null {
        if (this.content === null) {
            return null;
        }
        const count: Record<string, number> = {};
        const match = this.content
            .toString()
            .matchAll(/:([a-zA-Z0-9_-]+(@\w+\.\w+)*):/g);
        for (const element of match) {
            if (count[element[0]]) {
                count[element[0]]++;
            } else {
                count[element[0]] = 1;
            }
        }
        return count;
    }

    /**
     * Boost the note without adding additional content.
     * @param {boolean} local Federate the note.
     * @param {Omit<NoteVisibility, NoteVisibility.Specified>} visibility The scope of who is able to view your message.
     * @returns {Promise<void>}
     * @see {@link quote}
     */
    async renote(
        local = true,
        visibility?: Omit<NoteVisibility, NoteVisibility.Specified>,
    ): Promise<void> {
        return await misskeyRequest(this.cardboard, "notes/create", {
            renoteId: this.note.id,
            localOnly: local,
            visibility,
        });
    }

    /**
     * Boost the post while adding additional information, usually above the first note.
     * @param {string} content The contents of your message.
     * @param {NoteOptions} options Any additional options you would like to set.
     * @returns {Promise<Note>}
     */
    async quote(
        content: string,
        options?: Omit<NoteOptions, "replyId" | "renoteId" | "channelId">,
    ): Promise<Note> {
        return await this.cardboard.createNote(content, {
            renoteId: this.note.id,
            text: content,
            ...options,
        });
    }
    /**
     * Delete the note, if you have permission.
     * @returns {Promise<void>}
     */
    async delete(): Promise<void> {
        return await misskeyRequest(this.cardboard, "notes/delete", {
            noteId: this.note.id,
        });
    }
}
