import type { CardboardClient } from "..";
import type { MisskeyInvite } from "../types/admin";
import { misskeyRequest } from "./requestHelper";

export class Invite {
    constructor(
        private readonly cardboard: CardboardClient,
        private readonly invite: MisskeyInvite,
    ) {}

    /**
     * The System ID
     */
    get id(): string {
        return this.invite.id;
    }

    get code(): string {
        return this.invite.code;
    }

    get expiresAt(): Date {
        return new Date(this.invite.expiresAt);
    }

    get createdAt(): Date {
        return new Date(this.invite.createdAt);
    }

    get usedAt(): Date | null {
        if (this.invite.usedAt) {
            return new Date(this.invite.usedAt);
        }
        return null;
    }

    get used(): boolean {
        return this.invite.used;
    }

    async delete(): Promise<void> {
        await misskeyRequest(this.cardboard, "invite/delete", {
            inviteId: this.invite.id,
        });
    }
}
