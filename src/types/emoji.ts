export type Emoji = {
    id: string;
    aliases: string[];
    name: string;
    category: string | null;
    host: string | null;
    url: string;
    license: string | null;
    isSensitive: boolean;
    localOnly: boolean;
    roleIdsThatCanBeUsedThisEmojiAsReaction: string[];
};
