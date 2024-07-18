import pkg from "~/package.json" assert { type: "json" };
import type { CardboardClient } from "..";
import { Note } from "./noteFactory";

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
        const websocketBuilder = new URL(
            `/streaming?i=${this.cardboard.accessToken}`,
            `wss://${this.cardboard.instance}`,
        );
        this.websocket = new WebSocket(websocketBuilder, {
            // @ts-ignore headers is sanctioned by Bun.
            headers: {
                "user-agent": `Cardboard/${pkg.version} (Misskey Bot; https://cardboard.kitsu.life/)`,
                "content-type": "application/json; charset=utf8",
                accept: "application/json",
                "accept-encoding": "gzip, deflate, br",
            },
        });

        this.websocket.addEventListener("message", (rawData) => {
            const data = JSON.parse(rawData.data);
            //TODO: Not sure what else to add here.
            // Will come back in time.
            // Default catchall will service the rest in the meantime.
            if (data.type === "channel") {
                switch (data.body.type) {
                    case "note": {
                        this.cardboard.emit(
                            "note",
                            new Note(this.cardboard, data.body.body),
                        );
                        break;
                    }
                    case "mention":
                        this.cardboard.emit(
                            "mention",
                            new Note(this.cardboard, data.body.body),
                        );
                        break;
                    default:
                        //This ia a catchall operator that will call out events as misskey says them- and they're only parsed, not wrapped @ the Note Factory.
                        // Not sure I fully like that tbh.
                        this.cardboard.emit(data.body.type, data.body.body);
                }
            }
        });

        this.websocket.addEventListener("close", () => {
            //TODO: Reconnect to the websocket.
        });

        this.websocket.addEventListener("open", () => {
            this.websocket.send(
                JSON.stringify({
                    type: "connect",
                    body: {
                        channel: "main",
                        id: this.id++,
                    },
                }),
            );
            this.websocket.send(
                JSON.stringify({
                    type: "connect",
                    body: {
                        channel: this.websocketOptions.TimelineType,
                        id: this.id++,
                        params: {
                            withRenotes: !!this.websocketOptions.withRenotes,
                            withReplies: !!this.websocketOptions.withReplies,
                            withBots: !!this.websocketOptions.withBots,
                        },
                    },
                }),
            );
            this.cardboard.emit("ready");
        });
    }

    private id = 0;
    websocket: WebSocket;
}
