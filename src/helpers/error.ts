export class AuthenticationError extends Error {
    constructor() {
        super();
        this.name = "AuthenticationError";
        this.message = "Your token is not valid.";
    }
}

export class NotValidJsonError extends Error {
    constructor() {
        super();
        this.name = "NotValidJsonError";
        this.message =
            "I accessed a file & it's not JSON, like *key reports as. This is not allowed.";
    }
}

export class BadOffsetError extends Error {
    constructor() {
        super();
        this.name = "BadOffsetError";
        this.message = "You are trying to offset below 0. This is not allowed.";
    }
}

export class PopulatedFolderError extends Error {
    constructor() {
        super();
        this.name = "PopulatedFolderError";
        this.message =
            "There are files a/o folders in the folder you'd like to delete, and recursive is not truthy; so this action is disallowed.";
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
