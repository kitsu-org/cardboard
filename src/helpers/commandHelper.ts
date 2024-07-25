import type { CardboardClient } from "..";
import type { Note } from "./noteHelper";
import type { User } from "./userHelper";

export default class Command {
    constructor(protected readonly cardboard: CardboardClient) {
        this.cardboard.on("note", this.onNote);
        this.cardboard.on("mention", this.onMention);
        this.cardboard.on("follow", this.onFollow);
        this.cardboard.on("unfollow", this.onUnfollow);
        this.cardboard.on("delete", this.onMsgDelete);
        this.cardboard.on("reaction", this.onReact);
        this.onStartup();
    }

    onStartup(): void {
        return;
    }

    // biome-ignore lint/correctness/noUnusedVariables: This is a template c:
    onNote(message: Note): void {
        return;
    }

    // biome-ignore lint/correctness/noUnusedVariables: This is a template c:
    onFollow(user: User): void {
        return;
    }

    // biome-ignore lint/correctness/noUnusedVariables: This is a template c:
    onUnfollow(user: User): void {
        return;
    }

    // biome-ignore lint/correctness/noUnusedVariables: This is a template c:
    onMsgDelete(deletedMessage: { id: string; deletedAt: string }): void {
        return;
    }

    // biome-ignore lint/correctness/noUnusedVariables: This is a template c:
    onMention(message: Note): void {
        return;
    }

    // biome-ignore lint/correctness/noUnusedVariables: This is a template c:
    onReact(reaction: {
        noteId: string;
        reaction: string;
        userId: string;
    }): void {
        return;
    }
}
