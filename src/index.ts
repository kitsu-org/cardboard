import { readdir } from "node:fs/promises";
import { NoteBuilder } from "./helpers/NoteBuilder";
import { PollBuilder } from "./helpers/PollBuilder";
import { Admin } from "./helpers/adminHelper";
import { Drive } from "./helpers/driveHelper";
// import { IterableArray } from "./helpers/iterableArrayHelper";
import { Logger } from "./helpers/logHelper";
import { Note } from "./helpers/noteHelper";
import { misskeyRequest } from "./helpers/requestHelper";
import { SelfUser } from "./helpers/selfUserHelper";
import { User } from "./helpers/userHelper";

import { Box } from "./helpers/boxHelper";
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
    reply: (note: Note) => void;
}
/**
 *
 * {@link Drive}
 */
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
==========
You've enabled bypassNoBot. I understand that this can be a bit of a nuisance, but some users would rather not be interacted with.
This error is to ensure that your bot is respectful of people's wishes.
To stop this warning, please disable bypassNoBot.
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

    public async addFolder(boxFolder: string): Promise<void> {
        const folder = await readdir(boxFolder);
        for (const file of folder) {
            this.addBox(`${boxFolder}/${file}`);
        }
    }

    public async getPostsByTag(
        tag: string,
        limit = 10,
        allowPartial = true,
    ): Promise<Note[]> {
        const response = await misskeyRequest(this, "notes/search-by-tag", {
            tag,
            limit,
            allowPartial,
        });
        const posts: Note[] = [];
        // const posts: Note[] = new IterableArray(
        //     this,
        //     "notes/search-by-tag",
        //     { tag, limit, allowPartial },
        //     [],
        // );
        for (const post of response) {
            posts.push(new Note(this, post));
        }
        return posts;
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
        return request;
        // return new IterableArray(
        //     this,
        //     "federation/instances",
        //     options,
        //     request,
        //     true,
        // );
    }

    /**
     * Add a box for Cardboard to work with.
     * @param boxFile - the file leading to the box in question.
     */
    public addBox(boxFile: string): void {
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

    /**
     * Find a user by a username & host.
     * @param {string} [username] The username you'd like to search for.
     * @param {string|null|undefined} [host] - the host. if undefined or null, will search the home server.
     * @param {number|undefined} limit the limit. [1..100] is the limit.
     * @returns {User[]}
     */
    public async findUser(
        username: string,
        host?: string | null,
        limit?: number,
    ): Promise<User[]> {
        const users = await misskeyRequest(
            this,
            "users/search-by-username-and-host",
            {
                username,
                host,
                limit,
            },
        );
        const userList: User[] = [];
        for (const user of users) {
            userList.push(new User(this, user));
        }
        return userList;
    }

    public async showUser(userId: string): Promise<User> {
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
        options?: NoteOptions,
    ): Promise<Note> {
        return new Note(
            this,
            (
                await misskeyRequest(this, "notes/create", {
                    text: content,
                    ...options,
                })
            ).createdNote,
        );
    }

    /**
     * Registers an event listener for the specified event.
     * @template Event - The type of the event.
     * @param {Event | "*"} event - The event to listen for. Use "*" to listen for all events.
     * @param {Events[Event]} listener - The callback function to execute when the event is emitted.
     */
    on<Event extends keyof Events>(
        event: Event | "*",
        listener: Events[Event],
    ): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.push(listener);
        } else {
            this.eventListeners.set(event, [listener]);
        }
    }
    
    /**
     * Removes an event listener for the specified event.
     * @template Event - The type of the event.
     * @param {Event | "*"} event - The event to remove the listener from. Use "*" to remove from all events.
     * @param {Events[Event]} [listener] - The callback function to remove. If not provided, all listeners for the event will be removed.
     */
    off<Event extends keyof Events>(
        event: Event | "*",
        listener?: Events[Event],
    ): void {
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
    
    /**
     * Emits an event, calling all registered listeners for that event.
     * @template Event - The type of the event.
     * @param {Event} event - The event to emit.
     * @param {...Parameters<Events[Event]>} args - The arguments to pass to the event listeners.
     */
    emit<Event extends keyof Events>(
        event: Event,
        ...args: Parameters<Events[Event]>
    ): void {
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

export { NoteBuilder, PollBuilder, Box };
