/**
 * if you're looking to create a poll, you should probably look at the PollBuilder Class.
 * @see {@link PollBuilder}
 * @module PollBuilder
 */

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

/**
 * The settings of the poll.
 */
export type PollSettings = {
    /**
     * Whether or not a user can select multiple options in the poll.
     */
    multipleChoice: boolean;
    /**
     * An exact epoch time for when the poll closes.
     */
    expiresAt?: null | number;
    /**
     * {unknown. if you know, open an issue!}
     */
    expiredAfter?: null | number;
};

/**
 * Easily create a poll by stringing the PollBuilder!
 * const poll = new PollBuilder()
 * poll.addOption("hamburger").addOption("fries").addOption("both!")
 * await cardboard.createNote("hamburger or fries?", poll)
 */
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
            /**
             * the poll property that will be output when finished.
             */
            poll: {
                /**
                 * the compounded list of options added.
                 */
                choices: this._poll,
                /**
                 * the poll options that were set.
                 */
                ...this._pollSettings,
            },
        };
    }
}
