/**
 * @module Box
 * @see {@link Box}
 * @document documents/making-boxes.md
 */
import type { CardboardClient } from "..";
import type { Note } from "./noteHelper";
import type { User } from "./userHelper";

/**
 * The abstract method to creating a new box.
 *  use me as a template!
 */
export class Box {
    /**
     * Construct the Box.
     * @param cardboard the Cardboard parameter that cardboard will push upon initialization.
     */
    constructor(protected readonly cardboard: CardboardClient) {
        this.cardboard.on("note", this.onNote);
        this.cardboard.on("mention", this.onMention);
        this.cardboard.on("follow", this.onFollow);
        this.cardboard.on("unfollow", this.onUnfollow);
        this.cardboard.on("delete", this.onNoteDelete);
        this.cardboard.on("reaction", this.onReact);
        this.onStartup();
    }

    /**
     * What to do when the box is added.
     * @returns {void}
     * @example
     * onStartup() {
     *  console.log("command is ready!")
     * }
     */
    onStartup(): void {
        return;
    }

    /**
     * What to do when the box receives a note
     * @returns {void}
     * @example
     * onNote(note) {
     *  console.log(note.contents)
     * }
     */
    // biome-ignore lint/correctness/noUnusedVariables: This is a template c:
    onNote(message: Note): void {
        return;
    }
    /**
     * What to do when the box receives a follow
     * @returns {void}
     * @example
     * onFollow(user) {
     *  await user.dm(`hi! it's nice to meet you, ${user.user.username}!`)
     * }
     */
    // biome-ignore lint/correctness/noUnusedVariables: This is a template c:
    onFollow(user: User): void {
        return;
    }
    /**
     * What to do when the box receives an unfollow
     * @returns {void}
     * @example
     * onFollow(user) {
     *  await user.dm(`bye bye, ${user.user.username}! It was nice hanging out!`)
     * }
     */
    // biome-ignore lint/correctness/noUnusedVariables: This is a template c:
    onUnfollow(user: User): void {
        return;
    }

    /**
     * What to do when the box noticed a deleted note
     * @returns {void}
     */
    // biome-ignore lint/correctness/noUnusedVariables: This is a template c:
    onNoteDelete(deletedMessage: { id: string; deletedAt: string }): void {
        return;
    }

    /**
     * What should the box do if the bot received a mention
     * @returns {void}
     * @example
     * onMention(message) {
     *  await msg.react("👍")
     * }
     */
    // biome-ignore lint/correctness/noUnusedVariables: This is a template c:
    onMention(message: Note): void {
        return;
    }

    /**
     * What to do when the box notices a reaction
     * @returns {void}
     */
    // biome-ignore lint/correctness/noUnusedVariables: This is a template c:
    onReact(reaction: {
        noteId: string;
        reaction: string;
        userId: string;
    }): void {
        return;
    }
}
