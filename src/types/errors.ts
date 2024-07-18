export class AuthenticationError extends Error {
    constructor() {
        super();
        this.name = "AuthenticationError";
        this.message = "Your token is not valid.";
    }
}

export class PermissionDeniedError extends Error {
    constructor() {
        super();
        this.name = "PermissionDenied";
        this.message =
            "You are not able to use this command with the permissions this token has been granted.";
    }
}
