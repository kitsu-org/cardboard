import type { CardboardClient } from "..";
import type { MisskeyRole } from "../types/user";

export class Role {
    constructor(
        private readonly cardboard: CardboardClient,
        private readonly role: MisskeyRole,
    ) {}
}
