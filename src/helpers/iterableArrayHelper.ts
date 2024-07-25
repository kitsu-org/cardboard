import type { CardboardClient } from "..";
import { BadOffsetError } from "../types/error";
import { misskeyRequest } from "./requestHelper";

export class IterableArray extends Array {
    constructor(
        private readonly cardboard: CardboardClient,
        private readonly callNeeded: string,
        private readonly options: Record<string, unknown> | undefined,
        array: Record<string, unknown>[],
        private readonly iterateByOffsetAndLimit?: boolean,
    ) {
        //@ts-expect-error Why is TS complaining here? This is a perfectly valid command.
        super(...array);
    }

    public async next(limit = 100) {
        let response: Record<string, unknown>[];
        if (this.iterateByOffsetAndLimit) {
            response = await misskeyRequest(this.cardboard, this.callNeeded, {
                limit,
                ...this.options,
                //@ts-expect-error don't feel like dealing with you.
                offset: this.options.offset + this.options.limit,
            });
        } else {
            response = await misskeyRequest(this.cardboard, this.callNeeded, {
                sinceId: this[this.length - 1].id,
                limit,
                ...this.options,
            });
        }

        return new IterableArray(
            this.cardboard,
            this.callNeeded,
            this.options,
            response,
        );
    }
    public async previous(limit = 100) {
        let response: Record<string, unknown>[];
        if (this.iterateByOffsetAndLimit) {
            //@ts-expect-error just shh.
            if (this.options.offset - limit < 0) {
                throw BadOffsetError;
            }
            response = await misskeyRequest(this.cardboard, this.callNeeded, {
                ...this.options,
                //@ts-expect-error just shh.
                offset: this.options?.offset - this.options.limit,
            });
        } else {
            response = await misskeyRequest(this.cardboard, this.callNeeded, {
                untilId: this[0].id,
                limit,
                ...this.options,
            });
        }
        return new IterableArray(
            this.cardboard,
            this.callNeeded,
            this.options,
            response,
        );
    }
}
