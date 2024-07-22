import type { CardboardClient } from "..";
import pkg from "../../package.json" assert { type: "json" };
import { Note } from "./noteHelper";
import { misskeyRequest } from "./requestHelper";
import { User } from "./userHelper";

export enum TimelineType {
    Local = "localTimeline",
    Global = "globalTimeline",
}

export type WebsocketOptions = {
    TimelineType: TimelineType;
    withRenotes?: boolean;
    withReplies?: boolean;
    withBots?: boolean;
};

export class CardboardWebsocket {
    constructor(
        private readonly cardboard: CardboardClient,
        public readonly websocketOptions: WebsocketOptions,
    ) {
        const connect = () => {
            // Verify Validity of Token before trying to jam it into the websocket builder.
            this.cardboard.logger.debug("[WS] authenticating...");
            misskeyRequest(this.cardboard, "i").then(() => {
                const websocketBuilder = new URL(
                    `/streaming?i=${this.cardboard.accessToken}`,
                    `wss://${this.cardboard.instance}`,
                );

                this.cardboard.logger.debug("[WS] Starting Connection...");
                this.websocket = new WebSocket(websocketBuilder, {
                    // @ts-ignore headers is sanctioned by Bun.
                    headers: {
                        "user-agent": `Cardboard/${pkg.version} (Misskey Bot; https://cardboard.kitsu.life/)`,
                        "content-type": "application/json; charset=utf8",
                        accept: "application/json",
                        "accept-encoding": "gzip, deflate, br",
                    },
                });
                // TODO: This should be a proper handler.
                this.websocket.addEventListener("error", console.error);

                this.websocket.addEventListener("message", (rawData) => {
                    const data = JSON.parse(rawData.data);
                    cardboard.logger.verbose(`[WS] <- -- ${rawData.data}`);
                    //TODO: Not sure what else to add here.
                    // Will come back in time.
                    // Default catchall will service the rest in the meantime.
                    if (data.type === "channel") {
                        switch (data.body.type) {
                            case "receiveFollowRequest": {
                                this.cardboard.logger.debug(
                                    `[WS] user ${data.body.id} followed.`,
                                );
                                this.cardboard.emit(
                                    "followRequest",
                                    new User(this.cardboard, data.body.body),
                                );
                                break;
                            }
                            case "reacted": {
                                this.cardboard.emit("reaction", {
                                    noteId: data.body.id,
                                    reaction: data.body.body.reaction,
                                    userId: data.body.body.userId,
                                });
                                break;
                            }
                            case "follow": {
                                this.cardboard.logger.debug(
                                    `[WS] user ${data.body.id} followed.`,
                                );
                                this.cardboard.emit(
                                    "follow",
                                    new User(this.cardboard, data.body.body),
                                );
                                break;
                            }
                            case "unfollow": {
                                this.cardboard.logger.debug(
                                    `[WS] user ${data.body.id} unfollowed.`,
                                );
                                this.cardboard.emit(
                                    "unfollow",
                                    new User(this.cardboard, data.body.body),
                                );
                                break;
                            }
                            case "updated": {
                                this.cardboard.logger.debug(
                                    `[WS] note ${data.body.id} updated.`,
                                );
                                this.cardboard.emit("delete", {
                                    id: data.body.id,
                                    deletedAt: data.body.body.deletedAt,
                                });
                                break;
                            }
                            case "deleted": {
                                this.cardboard.logger.debug(
                                    `[WS] note ${data.body.id} deleted.`,
                                );
                                this.cardboard.emit("delete", {
                                    id: data.body.id,
                                    deletedAt: data.body.body.deletedAt,
                                });
                                break;
                            }
                            case "note": {
                                this.cardboard.logger.debug(
                                    `[WS] note ${data.body.body.id} received.`,
                                );
                                this.cardboard.emit(
                                    "note",
                                    new Note(this.cardboard, data.body.body),
                                );
                                break;
                            }
                            case "mention": {
                                this.cardboard.logger.debug(
                                    "[WS] mention received.",
                                );
                                this.cardboard.emit(
                                    "mention",
                                    new Note(this.cardboard, data.body.body),
                                );
                                break;
                            }
                            default: {
                                //This ia a catchall operator that will call out events as misskey says them- and they're only parsed, not wrapped @ the Note Factory.
                                // Not sure I fully like that tbh.
                                this.cardboard.logger.debug(
                                    `[WS] unknown type received! - ${data.body.type}`,
                                );
                                this.cardboard.emit(
                                    data.body.type,
                                    data.body.body,
                                );
                            }
                        }
                    }
                });
                this.websocket.addEventListener("close", () => {
                    //TODO: Reconnect to the websocket.
                    this.cardboard.logger.warn("[WS] Websocket closed.");
                    connect();
                    return;
                });

                this.websocket.addEventListener("open", () => {
                    this.cardboard.logger.debug("[WS] connected!");
                    this.cardboard.logger.verbose(
                        `[WS] -> -- ${JSON.stringify({
                            type: "connect",
                            body: {
                                channel: "main",
                                id: this.id++,
                            },
                        })}`,
                    );
                    this.websocket.send(
                        JSON.stringify({
                            type: "connect",
                            body: {
                                channel: "main",
                                id: this.id.toString(),
                            },
                        }),
                    );
                    this.cardboard.logger.verbose(
                        `[WS] -> -- ${JSON.stringify({
                            type: "connect",
                            body: {
                                channel: this.websocketOptions.TimelineType,
                                id: (this.id++).toString(),
                                params: {
                                    withRenotes:
                                        !!this.websocketOptions.withRenotes,
                                    withReplies:
                                        !!this.websocketOptions.withReplies,
                                    withBots: !!this.websocketOptions.withBots,
                                },
                            },
                        })}`,
                    );
                    this.cardboard.logger.debug("[WS] channel opened: main");
                    this.websocket.send(
                        JSON.stringify({
                            type: "connect",
                            body: {
                                channel: this.websocketOptions.TimelineType,
                                id: this.id.toString(),
                                params: {
                                    withRenotes:
                                        !!this.websocketOptions.withRenotes,
                                    withReplies:
                                        !!this.websocketOptions.withReplies,
                                    withBots: !!this.websocketOptions.withBots,
                                },
                            },
                        }),
                    );
                    this.cardboard.logger.debug(
                        `[WS] channel opened: ${this.websocketOptions.TimelineType}`,
                    );
                    this.cardboard.emit("ready");
                });
            });
        };
        connect();
    }

    private id = 0;
    websocket!: WebSocket;
}
