import { misskeyRequest } from "./requestHelper";
import { User } from "./userHelper";

export type MetaOptions = {
    location?: string;
    birthday?: string;
    followers?: {
        visibility?: "visible" | "friendsOnly" | "private";
        requireApproval?: boolean;
    };
    following?: {
        visibility?: "visible" | "friendsOnly" | "private";
    };
    visibility?: {
        online?: boolean;
        crawlers?: boolean;
        crawle: boolean;
        explore?: boolean;
        ai?: boolean;
        reactions?: boolean;
    };
    listenBrainz?: string;
    language?: string;
    fields?: { name: string; value: string }[];
    isBot?: boolean;
    catMode?: {
        earsVisible?: boolean;
        speech?: boolean;
    };
};

export class SelfUser extends User {
    async setDisplayName(name: string): Promise<void> {
        await misskeyRequest(
            this.cardboard.instance,
            this.cardboard.accessToken,
            "i/update",
            {
                name,
            },
        );
    }
    async setDescription(description: string): Promise<void> {
        await misskeyRequest(
            this.cardboard.instance,
            this.cardboard.accessToken,
            "i/update",
            {
                description,
            },
        );
    }

    //WONTFIX: Account deletion should not be programatic.

    //WONTFIX: I will never make a method for importing notes.
    //         That's a quick way to make a server _very_ unhappy.

    async setMeta(meta: MetaOptions): Promise<void> {
        await misskeyRequest(
            this.cardboard.instance,
            this.cardboard.accessToken,
            "i/update",
            {
                birthday: meta.birthday,
                isBot: meta.isBot,
                isCat: meta.catMode?.earsVisible,
                speakAsCat: meta.catMode?.speech,
                listenbrainz: meta.listenBrainz,
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
            },
        );
    }
}
