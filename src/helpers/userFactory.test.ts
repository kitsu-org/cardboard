import { type Mock, beforeEach, describe, expect, mock, test } from "bun:test";
import type { CardboardClient } from "../index";
import type { MisskeyUser } from "../types";
import { CannotHurtSelfError, NoBotInteractionError } from "../types/error";
import { misskeyRequest } from "./requestFactory";
import { User } from "./userFactory";

// Mock the dependencies
mock.module("./requestFactory", () => ({
    misskeyRequest: mock(() => Promise.resolve({})),
}));

describe("User", () => {
    let user: User;
    let mockClient: CardboardClient;
    let mockMisskeyUser: MisskeyUser;

    beforeEach(() => {
        mockClient = {
            instance: "example.com",
            accessToken: "test-token",
            createNote: mock(() => Promise.resolve({})),
        } as unknown as CardboardClient;

        mockMisskeyUser = {
            id: "test-user-id",
            username: "testuser",
            description: "test description",
        } as MisskeyUser;

        user = new User(mockClient, mockMisskeyUser);
    });

    test("suspend calls misskeyRequest correctly", async () => {
        await user.suspend("test note");
        expect(misskeyRequest).toHaveBeenCalledWith(
            "example.com",
            "test-token",
            "admin/suspend-user",
            { userId: "test-user-id" },
        );
        expect(misskeyRequest).toHaveBeenCalledWith(
            "example.com",
            "test-token",
            "admin/update-user-note",
            { userId: "test-user-id", text: "undefined\ntest note" },
        );
    });

    test("follow throws CannotHurtSelfError when trying to follow self", async () => {
        (misskeyRequest as Mock<typeof misskeyRequest>).mockResolvedValueOnce({
            id: "test-user-id",
        });
        await expect(user.follow()).rejects.toThrow(CannotHurtSelfError);
    });

    test("follow throws NoBotInteractionError when user has #nobot in description", async () => {
        (misskeyRequest as Mock<typeof misskeyRequest>).mockResolvedValueOnce({
            id: "different-id",
        });
        user = new User(mockClient, {
            ...mockMisskeyUser,
            description: "test #nobot",
        });
        await expect(user.follow()).rejects.toThrow(NoBotInteractionError);
    });

    test("DM calls createNote with correct parameters", async () => {
        await user.DM("Test message");
        expect(mockClient.createNote).toHaveBeenCalledWith("Test message", {
            visibility: "specified",
            text: "Test message",
            visibleUserIds: ["test-user-id"],
        });
    });
});
