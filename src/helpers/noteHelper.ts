import type { CardboardClient } from "../index";
import type { MisskeyNote, NoteOptions, NoteVisibility } from "../types/note";
import type { LiteUser } from "../types/user";
import { misskeyRequest } from "./requestHelper";

export class Note {
    constructor(
        private readonly cardboard: CardboardClient,
        public readonly note: MisskeyNote,
    ) {
        this.content = note.text;
        this.user = note.user;
    }

    public content: string | null;
    public user: LiteUser;

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

    /**
     * Boost the note without adding additional content.
     * @param {boolean} local Federate the note.
     * @param {NoteVisibility} visibility The scope of who is able to view your message.
     * @returns {Promise<void>}
     * @see {@link quote}
     */
    async renote(
        local = true,
        visibility?: Omit<NoteVisibility, NoteVisibility.Specified>,
    ): Promise<void> {
        return await misskeyRequest(
            this.cardboard.instance,
            this.cardboard.accessToken,
            "notes/create",
            { renoteId: this.note.id, localOnly: local, visibility },
        );
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
        return await misskeyRequest(
            this.cardboard.instance,
            this.cardboard.accessToken,
            "notes/delete",
            { noteId: this.note.id },
        );
    }
}
