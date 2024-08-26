import type { CardboardClient } from "..";
import type { Report } from "../types/admin";
import { misskeyRequest } from "./requestHelper";
import { User } from "./userHelper";

/**
 * A report that was generated for review.
 */
export class ReportItem {
    constructor(
        private readonly cardboard: CardboardClient,
        report: Report,
    ) {
        this.target = new User(cardboard, report.targetUser);
        this.reporter = new User(cardboard, report.reporter);
        this.resolved = report.resolved;
        this.createdAt = new Date(report.createdAt);
        this.comment = report.comment;
        this.id = report.id;
    }

    /**
     * the targeted user, a.k.a the "accused".
     */
    public readonly target: User;
    /**
     * The user who sent the report. if from a remote server, this'll usually be a system account, like instance.actor.
     */
    public readonly reporter: User;
    /**
     * whether or not the report has been resolved already.
     */
    public readonly resolved: boolean;
    /**
     * the Date the report was created
     */
    public readonly createdAt: Date;
    /**
     * the homeserver-generated ID for the report
     */
    public readonly id: string;
    /**
     * the comments left by the user who sent the report.
     */
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
