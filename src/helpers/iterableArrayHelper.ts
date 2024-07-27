// import type { CardboardClient } from "..";
// import { BadOffsetError } from "./error";
// import { misskeyRequest } from "./requestHelper";

//FIXME: IterableArray is my first time making a Pagination system for something like this.
// This is very poorly designed. THIS NEEDS FIXING.

// export class IterableArray<Type> extends Array {
//     constructor(
//         private readonly cardboard: CardboardClient,
//         private readonly callNeeded: string,
//         private options: Record<string, unknown>,
//         // biome-ignore lint/suspicious/noExplicitAny: Any type of Misskey-like object can be fed here.
//         array: any[],
//         private readonly iterateByOffsetAndLimit?: boolean,
//     ) {
//         super(...array);
//     }

//     public async next(limit = 100): Promise<IterableArray<Type>> {
//         let response: Record<string, unknown>[];
//         if (this.iterateByOffsetAndLimit) {
//             if (this.options === undefined) {
//                 this.options = { offset: 0, limit: 0 };
//             }
//             if (this.options.offset === null) {
//                 this.options.offset = 0;
//             }
//             if (this.options.limit === null) {
//                 this.options.limit = 10;
//             }
//             response = await misskeyRequest(this.cardboard, this.callNeeded, {
//                 ...this.options,
//                 limit,
//                 offset:
//                     (this.options.offset ?? 0) + (this.options.limit ?? limit),
//             });
//             if (this.options === undefined) {
//                 this.options = { offset: limit, limit };
//             } else {
//                 this.options.offset += limit;
//             }
//         } else {
//             response = await misskeyRequest(this.cardboard, this.callNeeded, {
//                 ...this.options,
//                 untilId: this[this.length - 1].id,
//                 limit,
//             });
//         }

//         return new IterableArray(
//             this.cardboard,
//             this.callNeeded,
//             this.options,
//             response,
//             this.iterateByOffsetAndLimit,
//         );
//     }
//     public async previous(limit = 100): Promise<IterableArray<Type>> {
//         let response: Record<string, unknown>[];
//         if (this.iterateByOffsetAndLimit) {
//             if (this.options.offset - limit < 0) {
//                 throw new BadOffsetError();
//             }
//             response = await misskeyRequest(this.cardboard, this.callNeeded, {
//                 ...this.options,
//                 offset: this.options?.offset - this.options.limit,
//             });
//         } else {
//             response = await misskeyRequest(this.cardboard, this.callNeeded, {
//                 ...this.options,
//                 sinceId: this[0].id,
//                 limit,
//             });
//         }
//         return new IterableArray(
//             this.cardboard,
//             this.callNeeded,
//             this.options,
//             response,
//             this.iterateByOffsetAndLimit,
//         );
//     }
// }
