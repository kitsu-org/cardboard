import type { MetaOptions, PermissionsOptions } from "../types/user";
import { misskeyRequest } from "./requestHelper";
import { User } from "./userHelper";

/**
 * The SelfUser, which allows you to control your account.
 */
export class SelfUser extends User {
    /**
     * A way to change what people may see when they look at your post. This is not your username.
     * @param name A human-readable string that you wish to set your display name to.
     */
    async setDisplayName(name: string): Promise<void> {
        await misskeyRequest(this.cardboard, "i/update", {
            name,
        });
    }
    /**
     * Change the description, aka the bio.
     * @param description A human-readable string delimited by \n for newlines.
     */
    async setDescription(description: string): Promise<void> {
        await misskeyRequest(this.cardboard, "i/update", {
            description,
        });
    }

    /**
     * Create a restricted API key. By default, all parameters are disabled.
     * @remarks This is labelled as an internal endpoint. *Key devs may ask for it to be removed at any time,
     * and I will comply.
     */
    async createApiKey(options: PermissionsOptions): Promise<{
        /**
         * The token you can use.
         */
        token: string;
    }> {
        return await misskeyRequest(
            this.cardboard,
            "miauth/gen-token",
            options,
        );
    }

    //WONTFIX: Account deletion should not be programmatic.

    //WONTFIX: I will never make a method for importing notes.
    //         That's a quick way to make a server _very_ unhappy.

    /**
     * Set any optional, "filler" portions of your profile.
     * @param meta the options that you would like to set for the profile.
     */
    async setMeta(meta: MetaOptions): Promise<void> {
        await misskeyRequest(this.cardboard, "i/update", {
            birthday: meta.birthday,
            isBot: meta.isBot,
            isCat: meta.catMode?.earsVisible,
            speakAsCat: meta.catMode?.speech,
            listenbrainz: meta.ListenBrainz,
            location: meta.location,
            lang: meta.language,
            followingVisibility: meta.following?.visibility,
            followersVisibility: meta.followers?.visibility,
            noIndex: meta.visibility?.crawlers,
            noCrawle: meta.visibility,
            preventAiLearning: meta.visibility?.ai,
            hideOnlineStatus: meta.visibility?.online,
            isExplorable: meta.visibility?.explore,
            publicReactions: meta.visibility?.reactions,
            fields: meta.fields,
            isLocked: meta.followers?.requireApproval,
        });
    }
}
