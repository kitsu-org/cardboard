import { type Mock, beforeEach, describe, expect, mock, test } from "bun:test";
import { AuthenticationError, PermissionDeniedError } from "../types/error";
import { misskeyRequest } from "../helpers/requestHelper";
import type { CardboardClient } from "..";

describe("misskeyRequest", () => {
    let mockFetch: Mock<
        () => Promise<{
            ok: boolean;
            status?: number;
            headers?: Headers;
            json: () => Promise<unknown>;
        }>
    >;

    beforeEach(() => {
        mockFetch = mock(() =>
            Promise.resolve({
                ok: true,
                headers: new Headers({ "content-type": "application/json" }),
                json: () => Promise.resolve({ data: "test" }),
            }),
        );
        global.fetch = mockFetch as unknown as typeof global.fetch;
    });

    test("sends correct request", async () => {
        await misskeyRequest(
            {
                instance: "example.com",
                accessToken: "test-token",
            } as CardboardClient,
            "test/path",
            {
                option: "value",
            },
        );

        expect(mockFetch).toHaveBeenCalledWith(
            new URL("https://example.com/api/test/path"),
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({ i: "test-token", option: "value" }),
                headers: expect.objectContaining({
                    "content-type": "application/json; charset=utf8",
                    accept: "application/json",
                }),
            }),
        );
    });

    test("returns JSON response when successful", async () => {
        const result = await misskeyRequest(
            {
                instance: "example.com",
                accessToken: "test-token",
            } as CardboardClient,
            "test/path",
        );
        expect(result).toEqual({ data: "test" });
    });

    test("throws AuthenticationError on 401", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: () => Promise.resolve({}),
        });

        await expect(
            misskeyRequest(
                {
                    instance: "example.com",
                    accessToken: "test-token",
                } as CardboardClient,
                "test/path",
            ),
        ).rejects.toThrow(AuthenticationError);
    });

    test("throws PermissionDeniedError on 403", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 403,
            json: () => Promise.resolve({}),
        });

        await expect(
            misskeyRequest(
                {
                    instance: "example.com",
                    accessToken: "test-token",
                } as CardboardClient,
                "test/path",
            ),
        ).rejects.toThrow(PermissionDeniedError);
    });

    test("throws Error with message on other errors", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            headers: new Headers({
                "content-type": "application/json",
            }),
            json: () => Promise.resolve({ error: { message: "Test error" } }),
        });

        await expect(
            misskeyRequest(
                {
                    instance: "example.com",
                    accessToken: "test-token",
                } as CardboardClient,
                "test/path",
            ),
        ).rejects.toThrow("Test error");
    });
});
