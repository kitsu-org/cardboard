import { Note } from "./helpers/noteHelper";
import { misskeyRequest } from "./helpers/requestHelper";
import { User } from "./helpers/userHelper";
import {
    CardboardWebsocket,
    TimelineType,
    type WebsocketOptions,
} from "./helpers/websocketHelper";
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
        public readonly options?: {
            bypassNoBot?: boolean;
        },
    ) {
        if (options?.bypassNoBot === true) {
            console.warn(`
                ==========\n
                You've enabled bypassNoBot. I understand that this can be a bit of a nuisance, but some users would rather not be interacted with.\n
                This error is to ensure that your bot is respectful of people's wishes.\n
                To stop this warning, please disable bypassNoBot.\n
                ==========
                `);
        }
    }
    private eventListeners: Map<keyof Events | "*", Events[keyof Events][]> =
        new Map();

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

    public async findUser(
        username: string,
        host?: string | null,
        options?: {
            limit?: number;
        },
    ) {
        const users = await misskeyRequest(
            this.instance,
            this.accessToken,
            "users/search-by-username-and-host",
            {
                username,
                host,
                limit: options?.limit,
            },
        );
        if (users.length === 0) {
            return [];
        }
        const createdUsers: User[] = [];
        for (const user of users) {
            createdUsers.push(new User(this, user));
        }
        return createdUsers;
    }

    public async showUser(userId: string) {
        return new User(
            this,
            await misskeyRequest(
                this.instance,
                this.accessToken,
                "users/show",
                {
                    userId,
                },
            ),
        );
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
