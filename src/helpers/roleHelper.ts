import type { CardboardClient } from "..";
import type { MisskeyRole, Policies } from "../types/user";
import { misskeyRequest } from "./requestHelper";

export class UsersStillInRoleError extends Error {
    constructor() {
        super();
        this.name = "UsersStillInRoleError";
        this.message =
            "There are still users within the role, and you did not enable a force-delete. This is not allowed.";
    }
}

export class Role {
    constructor(
        private readonly cardboard: CardboardClient,
        private readonly role: MisskeyRole,
    ) {}

    get id(): string {
        return this.role.id;
    }

    get createdAt(): Date {
        return new Date(this.role.createdAt);
    }

    get updatedAt(): Date {
        return new Date(this.role.updatedAt);
    }

    get name(): string {
        return this.role.name;
    }

    get description(): string {
        return this.role.description;
    }

    get color(): string | null {
        return this.role.color;
    }

    get iconUrl(): string | null {
        return this.role.iconUrl;
    }

    get target(): "manual" | "conditional" {
        return this.role.target;
    }

    get condFormula(): Record<string, unknown> {
        return this.role.condFormula;
    }

    get isPublic(): boolean {
        return this.role.isPublic;
    }

    get isModerator(): boolean {
        return this.role.isModerator;
    }

    get isAdministrator(): boolean {
        return this.role.isAdministrator;
    }

    get isExplorable(): boolean | undefined {
        return this.role.isExplorable;
    }

    get asBadge(): boolean {
        return this.role.asBadge;
    }

    get canEditMembersByModerator(): boolean {
        return this.role.canEditMembersByModerator;
    }

    get displayOrder(): number {
        return this.role.displayOrder;
    }

    get policies(): Policies {
        return this.role.policies;
    }

    get usersCount(): number {
        return this.role.usersCount;
    }

    async update(
        role: Partial<
            Omit<MisskeyRole, "id" | "createdAt" | "updatedAt" | "usersCount">
        >,
    ): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/roles/update", {
            roleId: this.role.id,
            ...role,
        });
    }

    async delete(force: boolean): Promise<void> {
        if (this.role.usersCount >= 0 && !force) {
            throw UsersStillInRoleError;
        }
        await misskeyRequest(this.cardboard, "admin/roles/delete", {
            roleId: this.role.id,
        });
    }
}
