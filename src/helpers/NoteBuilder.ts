/**
 * @module NoteBuilder
 * @See {@link NoteBuilder}
 */

import type { CardboardClient } from "..";
import { NoteVisibility } from "../types";
import {
    NotEnoughOptionsError,
    PollOptionTooLongError,
    type PollSettings,
    TooManyPollOptionsError,
} from "./PollBuilder";
import type { Note } from "./noteHelper";

/**
 * You cannot use the PostBuilder more than once, to prevent accidental duplicate posting.
 * This method will throw an error if you attempt to send multiple posts.
 */
export class AlreadyPostedError extends Error {
    constructor() {
        super();
        this.name = "AlreadyPostedError";
        this.message =
            "To prevent accidental double-posting, NoteBuilders need to be disposed of after using post().";
    }
}

export class CannotEscapeSquareBracketsError extends Error {
    constructor() {
        super();
        this.name = "CannotEscapeSquareBracketsError";
        this.message =
            "You've inputted a square bracket into an MFM content-adder which cannot be escaped. This is not allowed.";
    }
}

/**
 * Process the arguments for consumption by MFM.
 * @internal
 * @param args The arguments to pass back as MFM-compatible arguments.
 * @returns {string}
 */
const processArgs = (args?: Record<string, unknown>): string => {
    if (!args) {
        return "";
    }
    let string = "";
    for (const key of Object.keys(args)) {
        string += `,${key}=${args[key]}`;
    }
    string = string.replace(/^\,/, ".");
    return string;
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

    /**
     * Get the contents of the pos.
     * @returns {string}
     */
    get content(): string {
        return this._content;
    }
    /**
     * Get the current visibility of the post.
     * @returns {NoteVisibility}
     */
    get visibility(): NoteVisibility {
        return this._visibility;
    }
    /**
     * Return whether or not the post is going to be broadcasted.
     * @returns {boolean}
     */
    get federating(): boolean {
        return this._federating;
    }
    /**
     * Get the current poll settings. Will not have impact if there's no poll options.
     * @returns {PollSettings}
     */
    get pollSettings(): PollSettings {
        return this._pollOptions;
    }
    /**
     * Get the current poll options that users can select from.
     * @returns {string[]}
     */
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
     * @throws {AlreadyPostedError} You cannot modify the state of the text if you already posted.
     * @returns {NoteBuilder}
     */
    setContent(content: string): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        this._content = content;
        return this;
    }

    /**
     * Alias for addContent
     * @param content the content you'd like to append.
     * @returns {NoteBuilder}
     * @throws {AlreadyPostedError} You cannot modify the state of the text if you already posted.
     * @see {@link addContent}
     */
    add(content: string): NoteBuilder {
        return this.addContent(content);
    }

    /**
     *
     * @param content the content you'd like to append.
     * @returns {NoteBuilder}
     * @throws {AlreadyPostedError} You cannot modify the state of the text if you already posted.
     */
    addContent(content: string): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        this._content += content;
        return this;
    }

    /**
     * use $[tada <content>].
     * @param content The content you'd like to be tada'd.
     * @param args The optional arguments to modify the speed or delay of the tada.
     * @returns {NoteBuilder}
     */
    tada(
        content: string,
        args?: { speed?: number; delay?: number },
    ): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[tada${processArgs(args)} ${content}]`;
        return this;
    }

    /**
     * use $[jelly <content>].
     * @param content The content you'd like to be wiggled.
     * @param args The optional arguments to modify the speed or delay of the wiggle.
     * @returns {NoteBuilder}
     */
    jelly(
        content: string,
        args?: { speed?: number; delay?: number },
    ): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[jelly${processArgs(args)} ${content}]`;
        return this;
    }

    /**
     * use $[twitch <content>].
     * @param content The content you'd like to twitch.
     * @param args The optional arguments to modify the speed or delay of the twitching.
     * @returns {NoteBuilder}
     */
    twitch(
        content: string,
        args?: { speed?: number; delay?: number },
    ): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[twitch${processArgs(args)} ${content}]`;
        return this;
    }

    /**
     * use $[shake <content>].
     * @param content The content you'd like to be shaken (not stirred).
     * @param args The optional arguments to put your content in a blender.
     * @returns {NoteBuilder}
     */
    shake(
        content: string,
        args?: { speed?: number; delay?: number },
    ): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[shake${processArgs(args)} ${content}]`;
        return this;
    }

    /**
     * use $[twitch <content>].
     * @param content The content you'd like to spin.
     * @param args The optional arguments to modify the speed, delay, and the way of spiiin.
     * @returns {NoteBuilder}
     */
    spin(
        content: string,
        args?: {
            speed?: number;
            delay?: number;
            left?: boolean;
            alternate?: boolean;
            x?: boolean;
            y?: boolean;
        },
    ): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[spin${processArgs(args)} ${content}]`;
        return this;
    }

    /**
     * use $[jump <content>].
     * @param content The content you'd like to jump.
     * @param args The optional arguments to modify the speed or delay of the jump.
     * @returns {NoteBuilder}
     */
    jump(
        content: string,
        args?: { speed?: number; delay?: number },
    ): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[jump${processArgs(args)} ${content}]`;
        return this;
    }

    /**
     * use $[bounce <content>].
     * @param content The content you'd like to bounce.
     * @param args The optional arguments to make your content hyper or very sleepy.
     * @returns {NoteBuilder}
     */
    bounce(
        content: string,
        args?: { speed?: number; delay?: number },
    ): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[bounce${processArgs(args)} ${content}]`;
        return this;
    }

    /**
     * use $[flip <content>].
     * @param content The content you'd like to send to the mirror world.
     * @param args change which way the content is flipped, horizontally (h) or vertically (v).
     * @returns {NoteBuilder}
     */
    flip(content: string, args?: { h?: boolean; v?: boolean }): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[flip${processArgs(args)} ${content}]`;
        return this;
    }

    /**
     * use $[x2 <content>].
     * @param content The content you'd like to magnify.
     * @returns {NoteBuilder}
     */
    x2(content: string): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[x2 ${content}]`;
        return this;
    }

    /**
     * use $[x3 <content>].
     * @param content The content you'd like to triplify.
     * @returns {NoteBuilder}
     */
    x3(content: string): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[x3 ${content}]`;
        return this;
    }

    /**
     * use $[x4 <content>].
     * @param content The content you'd like to make too big.
     * @returns {NoteBuilder}
     */
    x4(content: string): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[x4 ${content}]`;
        return this;
    }

    /**
     * use $[scale <content>].
     * @param content The content you'd like to stretch.
     * @param {{x: number|undefined, y: number|undefined}} args The way in which to skew the content.
     * @returns {NoteBuilder}
     */
    scale(content: string, args: { x?: number; y?: number }): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[scale${processArgs(args)} ${content}]`;
        return this;
    }

    /**
     * use $[position <content>].
     * @param content The content you'd like to move.
     * @param {{x: number|undefined, y: number|undefined}} args The way in which to move the content.
     * @returns {NoteBuilder}
     */
    position(content: string, args: { x?: number; y?: number }): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[position${processArgs(args)} ${content}]`;
        return this;
    }

    /**
     *
     * @param content the content to color.
     * @param color the color to make the text.
     * @throws {AlreadyPostedError} You cannot add text.
     * @returns {NoteBuilder}
     */
    fg(content: string, color: string): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[fg.color=${color} ${content}]`;
        return this;
    }

    /**
     *
     * @param content the content to color.
     * @param color the color to make the background.
     * @throws {AlreadyPostedError} You cannot add content to a completed post.
     * @returns {NoteBuilder}
     */
    bg(content: string, color: string): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[bg.color=${color} ${content}]`;
        return this;
    }

    /**
     * add a border to the content.
     * @param content The content you'd like to add a border to.
     * @param args The optional arguments to add to modify the border.
     * @throws {AlreadyPostedError} You cannot add content to a completed post.
     * @returns {NoteBuilder}
     */
    border(
        content: string,
        args?: {
            width?: number;
            style?: "dashed" | "dotted" | "solid" | "inset" | "outset";
            color?: string;
            radius?: number;
            noclip?: boolean;
        },
    ): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[border${processArgs(args)} ${content}]`;
        return this;
    }

    /**
     * modify the font of the content you want to add
     * @param content the content you want to make ✨fancy✨
     * @param font a selection of fonts that you're able to pick from.
     * @throws {AlreadyPostedError} You cannot add content to a completed post.
     * @returns {NoteBuilder}
     */
    font(
        content: string,
        font: "serif" | "monospace" | "cursive" | "fantasy" | "emoji" | "math",
    ): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[font.${font} ${content}]`;
        return this;
    }

    /**
     * Add a blur effect to the text, which is removed when someone hovers over it.
     * @param content The content you wish to blur.
     * @throws {AlreadyPostedError} You cannot add content to a completed post.
     * @returns {NoteBuilder}
     */
    blur(content: string): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[blur ${content}]`;
        return this;
    }

    /**
     * Add a rainbow effect to your text.
     * @param content The content you want to make rainbow-y
     * @param args optional arguments used to effect how fast you show your pride.
     * @throws {AlreadyPostedError} You cannot add content to a completed post.
     * @returns {NoteBuilder}
     */
    rainbow(
        content: string,
        args?: { speed?: number; delay?: number },
    ): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[rainbow${processArgs(args)} ${content}]`;
        return this;
    }

    /**
     * Add a sparkle effect, which will make little sparkles appear around your text.
     * @param content The content you want to ✨shine✨
     * @throws {AlreadyPostedError} You cannot add content to a completed post.
     * @returns {NoteBuilder}
     */
    sparkle(content: string): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[sparkle ${content}]`;
        return this;
    }

    /**
     * Make everyone upset by adjusting the rotation of your content.
     * @param content The content you'd like to slightly adjust.
     * @param deg an optional parameter to change how much your content is rotated by. Default is 90°.
     * @returns {NoteBuilder}
     */
    rotate(content: string, deg?: number): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[rotate${deg ? `.deg=${deg}` : ""} ${content}]`;
        return this;
    }

    /**
     * (Kio has no idea what this does. Sorry.)
     * @param content The content you'd like to pass to the ruby
     * @throws {AlreadyPostedError} You cannot add content to a completed post.
     * @returns {NoteBuilder}
     */
    ruby(content: string): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[ruby ${content}]`;
        return this;
    }

    /**
     * Add a date-time to your note!
     * @param content The Unix Timestamp that you'd like to add.
     * @returns {NoteBuilder}
     */
    unixtime(content: number): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        this._content += `$[unixtime ${content}]`;
        return this;
    }

    /**
     * Alias of unixtime that uses a JS Date.
     * @param {Date} date the date you'd like to add to the content.
     * @returns {NoteBuilder}
     * @see {@link unixtime}
     */
    date(date: Date): NoteBuilder {
        return this.unixtime(Math.floor(date.getTime() / 1000));
    }

    /**
     * Crop your content.
     * @param content The content you want to partially (or fully) hide.
     * @param args a list of arguments to determine how to crop. At least one parameter is required.
     * @returns {NoteBuilder}
     */
    crop(
        content: string,
        args: { top?: number; bottom?: number; left?: number; right?: number },
    ): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[crop${processArgs(args)} ${content}]`;
        return this;
    }

    /**
     * Make your content fade, either in or out of existence.
     * @param content The content you want to make fade.
     * @param args a list of parameters to effect how your content fades. default is to fade in.
     * @returns {NoteBuilder}
     */
    fade(
        content: string,
        args?: { speed?: number; delay?: number; loop?: number; out?: boolean },
    ): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[fade${processArgs(args)} ${content}]`;
        return this;
    }

    /**
     * Make your content follow the user's mouse, for a challenging battle!
     * @param content The content that you'd like to make follow the mouse.
     * @param args a list of optional arguments to affect how the content interacts with the user.
     * @returns {NoteBuilder}
     */
    followmouse(
        content: string,
        args?: {
            x?: number;
            y?: number;
            rotateByVelocity?: boolean;
            speed?: number;
        },
    ): NoteBuilder {
        if (this._posted) {
            throw AlreadyPostedError;
        }
        if (content.includes("[") || content.includes("]")) {
            throw CannotEscapeSquareBracketsError;
        }
        this._content += `$[followmouse${processArgs(args)} ${content}]`;
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
        if (this._poll.length === 10) {
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
