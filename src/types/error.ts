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
        this.name = "PermissionDeniedError";
        this.message =
            "You are not able to use this command with the permissions this token has been granted.";
    }
}

export class NotImplementedError extends Error {
    constructor() {
        super();
        this.name = "NotImplementedError";
        this.message =
            "This method has not been implemented yet. For now, please use misskeyRequest.";
    }
}

export class NoBotInteractionError extends Error {
    constructor() {
        super();
        this.name = "NoBotInteractionError";
        this.message =
            "You cannot interact with this user, they have #nobot in their bio!";
    }
}

export class CannotHurtSelfError extends Error {
    constructor() {
        super();
        this.name = "CannotHurtSelf";
        this.message = "You cannot use this method on yourself.";
    }
}
