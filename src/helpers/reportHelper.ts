import type { CardboardClient } from "..";
import type { MisskeyUser } from "../types";
import { misskeyRequest } from "./requestHelper";
import { User } from "./userHelper";

export class ReportItem {
    constructor(
        cardboard: CardboardClient,
        report: {
            id: string;
            comment: string;
            createdAt: string;
            resolved: boolean;
            reporterId: string;
            targetUserId: string;
            assigneeId: string;
            reporter: MisskeyUser;
            targetUser: MisskeyUser;
            assignee?: MisskeyUser;
        },
    ) {
        this.target = new User(cardboard, report.targetUser);
        this.reporter = new User(cardboard, report.reporter);
        this.resolved = report.resolved;
        this.createdAt = new Date(report.createdAt);
        this.comment = report.comment;
        this.id = report.id;
        this.cardboard = cardboard;
    }
    private cardboard: CardboardClient;

    public readonly target: User;
    public readonly reporter: User;
    public readonly resolved: boolean;
    public readonly createdAt: Date;
    public readonly id: string;
    public readonly comment: string;

    /**
     * Resolve the report.
     * @param forward Forward the report to the remote server.
     */
    async resolve(forward?: boolean): Promise<void> {
        await misskeyRequest(this.cardboard, "admin/resolve-user-report", {
            reportId: this.id,
            forward,
        });
    }
}
