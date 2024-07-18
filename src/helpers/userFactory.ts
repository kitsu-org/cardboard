import type { MisskeyUser } from "@/types/user";
import type { CardboardClient } from "..";
import { NoteVisibility, type NoteOptions } from "@/types/note";
import type { Note } from "./noteFactory";

export class User {
    constructor(
        private readonly cardboard: CardboardClient,
        public readonly user: MisskeyUser,
    ) {}

    /**
     * Alias for creating a specified note for a user.
     * @param content The message you wish to send.
     * @param options The message options. Some are disabled.
     * @returns {Promise<Note>}
     */

    // biome-ignore lint/style/useNamingConvention: DM is an abbreviation for direct message.
    async DM(
        content: string,
        options?: Omit<NoteOptions, "text" | "visibility" | "visibleUserIds">,
    ): Promise<Note> {
        return await this.cardboard.createNote(content, {
            visibility: NoteVisibility.Specified,
            text: content,
            visibleUserIds: [this.user.id],
            ...options,
        });
    }
}
