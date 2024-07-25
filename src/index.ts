import { readdir } from "node:fs/promises";
import { Admin } from "./helpers/adminHelper";
import { Drive } from "./helpers/driveHelper";
import { IterableArray } from "./helpers/iterableArrayHelper";
import { Logger } from "./helpers/logHelper";
import { Note } from "./helpers/noteHelper";
import { misskeyRequest } from "./helpers/requestHelper";
import { SelfUser } from "./helpers/selfUserHelper";
import { User } from "./helpers/userHelper";
import {
    CardboardWebsocket,
    TimelineType,
    type WebsocketOptions,
} from "./helpers/websocketHelper";
import type { Emoji } from "./types/emoji";
import type { DeletedNote, NoteOptions, Reaction } from "./types/note";
import type { ServerSortOptions } from "./types/sorting";

interface Events {
    ready: () => void;
    mention: (msg: Note) => void;
    note: (note: Note) => void;
    delete: (deletedNote: DeletedNote) => void;
    follow: (user: User) => void;
    unfollow: (user: User) => void;
    followRequest: (user: User) => void;
    reaction: (react: Reaction) => void;
}

export class CardboardClient {
    constructor(
        public readonly instance: string,
        public readonly accessToken: string,
        public readonly options?: {
            bypassNoBot?: boolean;
            output?: "verbose" | "debug" | "log" | "warn" | "error" | "crit";
            logFile?: string;
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
        this.drive = new Drive(this);
        this.logger = new Logger(this);
        this.admin = new Admin(this);
    }
    private eventListeners: Map<keyof Events | "*", Events[keyof Events][]> =
        new Map();

    public async getSelf(): Promise<SelfUser> {
        return new SelfUser(this, await misskeyRequest(this, "i"));
    }

    public drive: Drive;
    public logger: Logger;
    public admin: Admin;

    public async addFolder(boxFolder: string) {
        const folder = await readdir(boxFolder);
        for (const file of folder) {
            this.addBox(`${boxFolder}/${file}`);
        }
    }

    /**
     * Get the emoji list.
     * Note: This can be a very extensive list. Filter at your own risk.
     */
    public async getEmojis(): Promise<{
        emojis: Omit<Emoji, "id" | "host" | "license" | "localOnly">[];
    }> {
        return await misskeyRequest(this, "emojis");
    }

    /**
     * Get the list of servers that your instance knows ab out, and the status they are at present.
     *
     */
    public async getFederatedServers(options: ServerSortOptions) {
        const request = await misskeyRequest(
            this,
            "federation/instances",
            options,
        );
        return new IterableArray(
            this,
            "federation/instances",
            options,
            request,
            true,
        );
    }

    /**
     * Add a box for Cardboard to work with.
     * @param command the file leading to the box in question.
     */
    public addBox(boxFile: string) {
        import(boxFile).then((found) => {
            new found.default(this);
        });
    }

    /**
     * connect the websocket to the backend.
     * @param websocketOptions Optional parameters that allow you to scale your userbase at the cost of performance.
     */
    public connect(
        websocketOptions: WebsocketOptions = {
            TimelineType: TimelineType.Global || TimelineType.Local,
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
            this,
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
            await misskeyRequest(this, "users/show", {
                userId,
            }),
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
            await misskeyRequest(this, "notes/create", {
                text: content,
                ...options,
            }),
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
