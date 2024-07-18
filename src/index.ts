import { Note } from "./helpers/noteFactory";
import { misskeyRequest } from "./helpers/requestFactory";
import {
    CardboardWebsocket,
    TimelineType,
    type WebsocketOptions,
} from "./helpers/websocketFactory";
import type { NoteOptions } from "./types/note";
import type { MisskeyUser } from "./types/user";

interface Events {
    ready: () => void;
    mention: (msg: Note) => void;
    note: (note: Note) => void;
}

export class CardboardClient {
    constructor(
        public readonly instance: string,
        public readonly accessToken: string,
    ) {}
    private eventListeners: Map<keyof Events | "*", Events[keyof Events][]> =
        new Map();

    //TODO: I wish to change this to a sort of PrivilegedUser
    // or SelfUser that allows greater control over the profile.
    /**
     * Queries /i and formats it into a Note.
     * @returns {Promise<MisskeyUser>} The user that is currently logged in.
     */
    public async getSelf(): Promise<MisskeyUser> {
        return await misskeyRequest(this.instance, this.accessToken, "i", {});
    }

    /**
     * connect the websocket to the backend.
     * @param websocketOptions Optional parameters that allow you to scale your userbase at the cost of performance.
     */
    public connect(
        websocketOptions: WebsocketOptions = {
            TimelineType: TimelineType.Local,
        },
    ): void {
        new CardboardWebsocket(this, websocketOptions);
    }

    /**
     * @param content The message you wish to send
     * @param {NoteOptions} options optional bits to fine-tune where and how your message is sent.
     * @returns {Promise<Note>}
     */
    public async createNote(
        content: string,
        options: NoteOptions,
    ): Promise<Note> {
        return new Note(
            this,
            await misskeyRequest(
                this.instance,
                this.accessToken,
                "notes/create",
                { text: content, ...options },
            ),
        );
    }

    on<Event extends keyof Events>(
        event: Event | "*",
        listener: Events[Event],
    ) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.push(listener);
        } else {
            this.eventListeners.set(event, [listener]);
        }
    }

    off<Event extends keyof Events>(
        event: Event | "*",
        listener?: Events[Event],
    ) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            if (listener) {
                this.eventListeners.set(
                    event,
                    listeners.filter((l) => l !== listener),
                );
            } else {
                this.eventListeners.set(event, []);
            }
        }
    }

    emit<Event extends keyof Events>(
        event: Event,
        ...args: Parameters<Events[Event]>
    ) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            for (const listener of listeners) {
                // @ts-expect-error Can't make TypeScript happy here because it doesn't know the parameters
                listener(...args);
            }
        }
        const allListeners = this.eventListeners.get("*");
        if (allListeners) {
            for (const listener of allListeners) {
                // @ts-expect-error Can't make TypeScript happy here because it doesn't know the parameters
                listener(...args);
            }
        }
    }
}
