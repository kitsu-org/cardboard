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
        /**
         * The current homeserver cardboard connects to.
         */
        public readonly instance: string,
        /**
         * the access token used.
         * @todo THIS IS A SECURITY RISK. We need to make this private!
         * @ignore
         */
        public readonly accessToken: string,
        /**
         * the initialized options for Cardboard.
         */
        public readonly options?: {
            /**
             * Whether or not bypassNoBot is enabled.
             * DISCOURAGED. If a user doesn't want to be interacted with, then _don't interact with them._
             */
            bypassNoBot?: boolean;
            /**
             * the verbosity of cardboard. By default, set to log.
             */
            output?: "verbose" | "debug" | "log" | "warn" | "error" | "crit";
            /**
             * the path of the logfile, if set.
             */
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

    /**
     * Get yourself as a user.
     * @returns {Promise<SelfUser>}
     */
    public async getSelf(): Promise<SelfUser> {
        return new SelfUser(this, await misskeyRequest(this, "i"));
    }

    /**
     * The bot's drive.
     * @see {@link Drive}
     */
    public drive: Drive;
    /**
     * Cardboard's custom log system.
     * @see {@link Logger}
     */
    public logger: Logger;
    /**
     * the administrative actions. functions in the admin class are more destructive.
     * @see {@link Admin}
     */
    public admin: Admin;

    /**
     * Load a folder's worth of boxes.
     * @param boxFolder the path that cardboard should look for boxes.
     */
    public async addFolder(boxFolder: string): Promise<void> {
        const folder = await readdir(boxFolder);
        for (const file of folder) {
            this.addBox(`${boxFolder}/${file}`);
        }
    }

    /**
     * Get posts by a hashtag.
     * @param tag the hashtag to search by.
     * @param limit the amount of posts to get. limit is [1..100].
     * @param allowPartial whether or not to simplify posts.
     * @returns {Note[]}
     */
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
        /**
         * A list of the emojis you'll receive.
         */
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

    /**
     * get a user by their userId.
     * @param userId the ID of the user that you'd like to retrieve.
     * @returns {Promise<User>}
     */
    public async showUser(userId: string): Promise<User> {
        return new User(
            this,
            await misskeyRequest(this, "users/show", {
                userId,
            }),
        );
    }

    /**
     * get a singular user by a username and host.
     * @param username the username to look for.
     * @param host optional. if set, search the remote server for a user.
     * @returns {Promise<User>}
     */
    public async showUserByUsernameAndHost(
        username: string,
        host?: string,
    ): Promise<User> {
        return new User(
            this,
            await misskeyRequest(this, "users/show", {
                username,
                host,
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
