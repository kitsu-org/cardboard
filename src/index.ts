import { Note } from "./helpers/noteFactory";
import { misskeyRequest } from "./helpers/requestFactory";
import {
    CardboardWebsocket,
    TimelineType,
    type WebsocketOptions,
} from "./helpers/websocketFactory";
import type { NoteOptions } from "./types/note";
import type { User } from "./types/user";

// TODO:
// Look at me - Done!
// Send a message - Done!
// Handle new notes - Done!
// Reply to an event - Done!
// Get a user - Must we? :thinking:

interface Events {
    ready: () => void;
    mention: (msg: Note) => void;
    note: (note: Note) => void;
}

export class CardboardClient {
    public instance!: string;
    public accessToken!: string;
    private eventListeners: Map<keyof Events | "*", Events[keyof Events][]> =
        new Map();

    /**
     * Queries /i and formats it into a FullUser.
     *
     * @returns {Promise<any>} The user that is currently logged in.
     */
    async getSelf(): Promise<User> {
        return await misskeyRequest(this.instance, this.accessToken, "i", {});
    }

    connect(
        instance: string,
        token: string,
        websocketOptions: WebsocketOptions = {
            TimelineType: TimelineType.Local,
        },
    ) {
        this.instance = instance;
        this.accessToken = token;
        new CardboardWebsocket(this, websocketOptions);
    }

    async createNote(content: string, options: NoteOptions): Promise<Note> {
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
