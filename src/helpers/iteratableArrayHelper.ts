import type { CardboardClient } from "..";
import { misskeyRequest } from "./requestHelper";

export class IterableArray extends Array {
    constructor(
        private readonly cardboard: CardboardClient,
        private readonly callNeeded: string,
        private readonly options: Record<string, unknown> | undefined,
        array: Record<string, unknown>[],
    ) {
        //@ts-expect-error Why is TS complaining here? This is a perfectly valid command.
        super(...array);
    }

    public async next(limit = 100) {
        const response = await misskeyRequest(this.cardboard, this.callNeeded, {
            sinceId: this[this.length - 1].id,
            limit,
            ...this.options,
        });
        return new IterableArray(
            this.cardboard,
            this.callNeeded,
            this.options,
            response,
        );
    }
    public async previous(limit = 100) {
        const response = await misskeyRequest(this.cardboard, this.callNeeded, {
            untilId: this[0].id,
            limit,
            ...this.options,
        });
        return new IterableArray(
            this.cardboard,
            this.callNeeded,
            this.options,
            response,
        );
    }
}
