import type { CardboardClient } from "..";
import pkg from "../../package.json" assert { type: "json" };
import { AuthenticationError, PermissionDeniedError } from "../types/error";

export const misskeyRequest = async (
    cardboard: CardboardClient,
    path: string,
    options?: Record<string, unknown>,
) => {
    const url = new URL(`/api/${path}`, `https://${cardboard.instance}`);
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            i: cardboard.accessToken,
            ...options,
        }),
        headers: {
            "user-agent": `Cardboard/${pkg.version} (Misskey Bot; https://cardboard.kitsu.life/)`,
            "content-type": "application/json; charset=utf8",
            accept: "application/json",
            "accept-encoding": "gzip, deflate, br",
        },
    });
    cardboard.logger.debug(`-> ${path} -- returned ${response.status}`);
    cardboard.logger.verbose(JSON.stringify(response));
    if (response.ok) {
        // Check if response is JSON
        if (
            response.headers.get("content-type")?.includes("application/json")
        ) {
            return await response.json();
        }
    } else {
        switch (response.status) {
            case 401:
                throw new AuthenticationError();
            case 403:
                throw new PermissionDeniedError();
            default: {
                if (
                    !response.headers
                        .get("content-type")
                        ?.includes("application/json")
                ) {
                    throw new Error(`Request Error: ${response.status}`);
                }
                const errorInfo = (await response.json()) as {
                    error: {
                        code: string;
                        message: string;
                        uuid: string;
                    };
                };
                throw {
                    name: errorInfo.error.code,
                    message: errorInfo.error.message,
                };
            }
        }
    }
};
