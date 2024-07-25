import { type Mock, beforeEach, describe, expect, mock, test } from "bun:test";
import { CannotHurtSelfError, NoBotInteractionError } from "../helpers/error";
import { misskeyRequest } from "../helpers/requestHelper";
import { User } from "../helpers/userHelper";
import type { CardboardClient } from "../index";
import type { MisskeyUser } from "../types";

// Mock the dependencies
mock.module("../helpers/requestHelper", () => ({
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
            {
                instance: "example.com",
                accessToken: "test-token",
            } as CardboardClient,
            "admin/suspend-user",
            { userId: "test-user-id" },
        );
        expect(misskeyRequest).toHaveBeenCalledWith(
            {
                instance: "example.com",
                accessToken: "test-token",
            } as CardboardClient,
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
        await user.dm("Test message");
        expect(mockClient.createNote).toHaveBeenCalledWith("Test message", {
            visibility: "specified",
            text: "Test message",
            visibleUserIds: ["test-user-id"],
        });
    });
});
