import type { CardboardClient } from "..";
import pkg from "../../package.json" assert { type: "json" };
import {
    AuthenticationError,
    NotValidJsonError,
    PermissionDeniedError,
} from "./error";

export const misskeyRequest = async (
    cardboard: CardboardClient,
    path: string,
    options?: Record<string, unknown> | FormData,
) => {
    const url = new URL(`/api/${path}`, `https://${cardboard.instance}`);
    const headers: {
        "user-agent": string;
        accept: string;
        "accept-encoding": string;
        "content-type"?: string;
    } = {
        "user-agent": `Cardboard/${pkg.version} (Misskey Bot; https://cardboard.kitsu.life/)`,
        accept: "application/json",
        "accept-encoding": "gzip, deflate, br",
    };
    if (!(options instanceof FormData)) {
        headers["content-type"] = "application/json; charset=utf8";
    }
    const response = await fetch(url, {
        method: "POST",
        body:
            options instanceof FormData
                ? options
                : JSON.stringify({
                      i: cardboard.accessToken,
                      ...options,
                  }),
        headers: headers,
    });
    cardboard.logger.debug(`-> ${path} -- returned ${response.status}`);
    cardboard.logger.verbose(JSON.stringify(options));
    if (response.ok) {
        // Check if response is JSON
        if (
            response.headers.get("content-type")?.includes("application/json")
        ) {
            return await response.json();
        }
        if (response.status === 204) {
            return;
        }

        throw NotValidJsonError;
    }
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
};
