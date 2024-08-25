/**
 * if you're looking to create a poll, you should probably look at the PollBuilder Class.
 * @see {PollBuilder}
 * @module
 */
import type { CardboardClient } from "..";

/**
 * Misskey requires more than one choice when a poll is made.
 * If you have only one choice, Cardboard will throw NotEnoughOptionsError.
 */
export class NotEnoughOptionsError extends Error {
    constructor() {
        super();
        this.name = "NotEnoughOptionsError";
        this.message =
            "There's not enough options in the poll you just made. This is not allowed.";
    }
}
/**
 * Misskey requires unique poll options.
 */
export class PollNoTwoAlikeError extends Error {
    constructor() {
        super();
        this.name = "PollNoTwoAlikeError";
        this.message = "Poll options must be unique.";
    }
}
/**
 * Misskey set the limit to poll options to 150 characters.
 */
export class PollOptionTooLongError extends Error {
    constructor() {
        super();
        this.name = "PollOptionTooLongError";
        this.message = "This poll option is too long! This is not allowed.";
    }
}

/**
 * The limit is 10 options. Any more, and Misskey will throw an error.
 */
export class TooManyPollOptionsError extends Error {
    constructor() {
        super();
        this.name = "TooManyPollOptionsError";
        this.message = "This poll option is too long! This is not allowed.";
    }
}

export type PollSettings = {
    multipleChoice: boolean;
    expiresAt?: null | number;
    expiredAfter?: null | number;
};

export class PollBuilder {
    private _poll: string[] = [];
    private _pollSettings: PollSettings = {
        multipleChoice: false,
    };

    /**
     *
     * @param option The text of the option you'd like to add.
     * @throws {PollNoTwoAlikeError} You cannot replicate poll options.
     * @throws {PollOptionTooLongError} There's a limit of 150 chars in a poll option.
     * @throws {TooManyPollOptionsError} You cannot have more than 10 options.
     * @returns
     */
    public addOption(option: string): PollBuilder {
        if (this._poll.includes(option)) {
            throw PollNoTwoAlikeError;
        }
        if (option.length >= 150) {
            throw PollOptionTooLongError;
        }
        if (this._poll.length === 10) {
            throw TooManyPollOptionsError;
        }
        this._poll.push(option);
        return this;
    }
    /**
     * Set settings for the poll.
     * @param multipleChoice Whether the user can select multiple options.
     * @param expiresAt An exact epoch of when the poll expires.
     * @param expiredAfter Unknown. :c
     */
    public setSettings(
        multipleChoice = false,
        expiresAt?: number | null,
        expiredAfter?: number | null,
    ): PollBuilder {
        if (multipleChoice) {
            this._pollSettings.multipleChoice = multipleChoice;
        }
        if (expiresAt) {
            this._pollSettings.expiresAt = expiresAt;
        }
        if (expiredAfter) {
            this._pollSettings.expiredAfter = expiredAfter;
        }
        return this;
    }

    /**
     * Finish the poll. the best way to use this is with ...poll.finish inside your createNote.
     */
    get finish() {
        return {
            poll: {
                choices: this._poll,
                multiple: this._pollSettings.multipleChoice,
                expiresAt: this._pollSettings.expiresAt,
                expiredAfter: this._pollSettings.expiredAfter,
            },
        };
    }
}
