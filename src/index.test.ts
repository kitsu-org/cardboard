import {
    type Mock,
    beforeEach,
    describe,
    expect,
    jest,
    mock,
    test,
} from "bun:test";
import { misskeyRequest } from "./helpers/requestFactory";
import { CardboardWebsocket, TimelineType } from "./helpers/websocketFactory";
import { CardboardClient } from "./index";
import { NoteVisibility } from "./types";

// Mock the dependencies
mock.module("./helpers/requestFactory", () => ({
    misskeyRequest: mock(() => Promise.resolve({})),
}));

mock.module("./helpers/websocketFactory", () => ({
    CardboardWebsocket: jest.fn(),
}));

describe("CardboardClient", () => {
    let client: CardboardClient;

    beforeEach(() => {
        client = new CardboardClient("example.com", "test-token");
    });

    test("constructor initializes correctly", () => {
        expect(client.instance).toBe("example.com");
        expect(client.accessToken).toBe("test-token");
    });

    test("getSelf calls misskeyRequest correctly", async () => {
        await client.getSelf();
        expect(misskeyRequest).toHaveBeenCalledWith(
            "example.com",
            "test-token",
            "i",
            {},
        );
    });

    test("connect initializes CardboardWebsocket", () => {
        client.connect();
        expect(CardboardWebsocket).toHaveBeenCalledWith(client, {
            TimelineType: TimelineType.Local,
        });
    });

    test("findUser calls misskeyRequest correctly", async () => {
        (misskeyRequest as Mock<typeof misskeyRequest>).mockResolvedValueOnce(
            [],
        );
        await client.findUser("testuser", "testhost");
        expect(misskeyRequest).toHaveBeenCalledWith(
            "example.com",
            "test-token",
            "users/search-by-username-and-host",
            { username: "testuser", host: "testhost", limit: undefined },
        );
    });

    test("showUser calls misskeyRequest correctly", async () => {
        await client.showUser("test-user-id");
        expect(misskeyRequest).toHaveBeenCalledWith(
            "example.com",
            "test-token",
            "users/show",
            { userId: "test-user-id" },
        );
    });

    test("createNote calls misskeyRequest correctly", async () => {
        await client.createNote("Test content", {
            visibility: NoteVisibility.Public,
        });
        expect(misskeyRequest).toHaveBeenCalledWith(
            "example.com",
            "test-token",
            "notes/create",
            { text: "Test content", visibility: "public" },
        );
    });

    test("event emitter functionality", () => {
        const mockListener = mock(() => {
            // Empty
        });
        client.on("ready", mockListener);
        client.emit("ready");
        expect(mockListener).toHaveBeenCalled();

        client.off("ready", mockListener);
        client.emit("ready");
        expect(mockListener).toHaveBeenCalledTimes(1);
    });
});
