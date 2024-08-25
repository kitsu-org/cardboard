import type { CardboardClient } from "..";
import { NoteVisibility } from "../types";
import type { Note } from "./noteHelper";

export class NotEnoughOptionsError extends Error {
    constructor() {
        super();
        this.name = "NotEnoughOptionsError";
        this.message =
            "There's not enough options in the poll you just made. This is not allowed.";
    }
}

export class PollOptionTooLongError extends Error {
    constructor() {
        super();
        this.name = "PollOptionTooLongError";
        this.message = "This poll option is too long! This is not allowed.";
    }
}

export class TooManyPollOptionsError extends Error {
    constructor() {
        super();
        this.name = "TooManyPollOptionsError";
        this.message = "This poll option is too long! This is not allowed.";
    }
}

export class AlreadyPostedError extends Error {
    constructor() {
        super();
        this.name = "AlreadyPostedError";
        this.message =
            "To prevent accidental double-posting, NoteBuilders need to be disposed of after using post().";
    }
}

export type PollSettings = {
    multipleChoice: boolean;
    expiresAt?: null | number;
    expiredAfter?: null | number;
};

export class NoteBuilder {
    constructor(private readonly cardboard: CardboardClient) {}
    private _content = "";
    private _visibility: NoteVisibility = NoteVisibility.Public;
    private _poll: string[] = [];
    private _federating = true;
    private _posted = false;
    private _pollOptions: PollSettings = {
        multipleChoice: false,
    };

    get content(): string {
        return this._content;
    }
    get visibility(): NoteVisibility {
        return this._visibility;
    }
    get federating(): boolean {
        return this._federating;
    }
    get pollSettings(): PollSettings {
        return this._pollOptions;
    }
    get poll(): string[] {
        return this._poll;
    }

    /**
     * Set the ability to federate the note.
     * @param {boolean} [federating=true] - Whether or not the note will leave your home server.
     * @returns {NoteBuilder}
     */
    setFederating(federating: boolean): NoteBuilder {
        this._federating = federating;
        return this;
    }

    /**
     * Set the content of the note!
     * @param content The content that you would like to note.
     * @returns {NoteBuilder}
     */
    setContent(content: string): NoteBuilder {
        this._content = content;
        return this;
    }

    /**
     * Set the visibility of the note!
     * @param visibility The new visibility
     * @returns {NoteBuilder}
     */
    setVisibility(visibility: NoteVisibility): NoteBuilder {
        this._visibility = visibility;
        return this;
    }

    /**
     * Add (another) option to the poll.
     * @param {string} [option] The poll option you'd like to add.
     * @throws {PollOptionTooLongError} Your new option must bee less than 150 characters in length.
     * @throws {TooManyPollOptionsError} You may have up to 10 items in a poll.
     * @returns {NoteBuilder}
     */
    addPollOption(option: string): NoteBuilder {
        if (option.length >= 150) {
            throw PollOptionTooLongError;
        }
        if (this._poll.length + 1 === 11) {
            throw TooManyPollOptionsError;
        }
        this._poll.push(option);
        return this;
    }

    setPollSettings(
        multipleChoice = false,
        expiresAt?: number | null,
        expiredAfter?: number | null,
    ) {
        if (multipleChoice) {
            this._pollOptions.multipleChoice = multipleChoice;
        }
        if (expiresAt) {
            this._pollOptions.expiresAt = expiresAt;
        }
        if (expiredAfter) {
            this._pollOptions.expiredAfter = expiredAfter;
        }
    }

    /**
     * send the note you have created!
     * @throws {NotEnoughOptionsError} Polls must have more than one poll option in them.
     * @throws {AlreadyPostedError} You may only use a NoteBuilder once.
     * @returns {Note}
     */
    async post(): Promise<Note> {
        if (this._poll.length === 1) {
            throw NotEnoughOptionsError;
        }
        if (this._posted) {
            throw AlreadyPostedError;
        }

        const options: {
            visibility: NoteVisibility;
            localOnly: boolean;
            poll?: {
                choices: string[];
                multiple: boolean;
                expiredAfter?: null | number;
                expiresAt?: null | number;
            };
        } = {
            visibility: this._visibility,
            localOnly: this._federating,
        };

        if (this._poll.length !== 0) {
            options.poll = {
                choices: this._poll,
                multiple: this._pollOptions.multipleChoice,
                expiredAfter: this._pollOptions.expiredAfter,
                expiresAt: this._pollOptions.expiresAt,
            };
        }

        const note = await this.cardboard.createNote(this._content, options);

        this._posted = true;
        return note;
    }
}