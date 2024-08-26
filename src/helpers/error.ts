/**
 * Cardboard will complain if your token is not valid.
 */
export class AuthenticationError extends Error {
    constructor() {
        super();
        this.name = "AuthenticationError";
        this.message = "Your token is not valid.";
    }
}

/**
 * If Cardboard detects a non-json return, it'll throw a hissy-fit as to not damage anything account-wise.
 */
export class NotValidJsonError extends Error {
    constructor() {
        super();
        this.name = "NotValidJsonError";
        this.message =
            "I accessed a file & it's not JSON, like *key should report as. Bailing!!";
    }
}

/**
 * Protect against negative offsets.
 */
export class BadOffsetError extends Error {
    constructor() {
        super();
        this.name = "BadOffsetError";
        this.message = "You are trying to offset below 0. This is not allowed.";
    }
}

/**
 * Protect against permanent damage by preventing nonrecursive deletes.
 */
export class PopulatedFolderError extends Error {
    constructor() {
        super();
        this.name = "PopulatedFolderError";
        this.message =
            "There are files a/o folders in the folder you'd like to delete, and recursive is not truthy; so this action is disallowed.";
    }
}

/**
 * If Permission has been denied by misskey, Cardboard will intercept and throw a try..catch'able error.
 */
export class PermissionDeniedError extends Error {
    constructor() {
        super();
        this.name = "PermissionDeniedError";
        this.message =
            "You are not able to use this command with the permissions this token has been granted.";
    }
}

/**
 * If a function hasn't been implemented, then we'll use this. You will _NEVER_ see this in a function.
 */
export class NotImplementedError extends Error {
    constructor() {
        super();
        this.name = "NotImplementedError";
        this.message =
            "This method has not been implemented yet. For now, please use misskeyRequest.";
    }
}

/**
 * If NoBot Detection is enabled (by default it is), then throw if you try to interact with them.
 */
export class NoBotInteractionError extends Error {
    constructor() {
        super();
        this.name = "NoBotInteractionError";
        this.message =
            "You cannot interact with this user, they have #nobot in their bio!";
    }
}

/**
 * Prevent risky actions, like suspension, silencing from being ran, especially if cardboard is being ran
 * on a misbehaving instance that will accept and action on these endpoints.
 */
export class CannotHurtSelfError extends Error {
    constructor() {
        super();
        this.name = "CannotHurtSelf";
        this.message = "You cannot use this method on yourself.";
    }
}
