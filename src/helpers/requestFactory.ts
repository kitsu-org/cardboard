import { AuthenticationError, PermissionDeniedError } from "../types/error";
import pkg from "../../package.json" assert { type: "json" };

export const misskeyRequest = async (
    instance: string,
    token: string,
    path: string,
    options?: Record<string, unknown>,
) => {
    const url = new URL(`/api/${path}`, `https://${instance}`);
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            i: token,
            ...options,
        }),
        headers: {
            "user-agent": `Cardboard/${pkg.version} (Misskey Bot; https://cardboard.kitsu.life/)`,
            "content-type": "application/json; charset=utf8",
            accept: "application/json",
            "accept-encoding": "gzip, deflate, br",
        },
    });

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
                const errorInfo = (await response.json()) as {
                    error: {
                        code: string;
                        message: string;
                        uuid: string;
                    };
                };
                throw new Error(errorInfo.error.message);
            }
        }
    }
};
