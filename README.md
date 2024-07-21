# Cardboard 📦
Cardboard is a module that allows you to easily work with misskey, with a focus on Sharkey. 

No dependencies, strictly typed, and looking quite stylish!

## Example
```js
import { CardboardClient } from '@kitsu-org/cardboard';
const cardboard = new CardboardClient("kitsunes.club", "yourkeyhere");

cardboard.on("ready", async () => {
    console.info(`ready!`);
});

cardboard.on("mention", async (msg) => {
    if (
        msg.note.text
            ?.replaceAll(`@${(await cardboard.getSelf()).user.username} `, "")
            .startsWith("hello")
    ) {
        await msg.reply("Cardboard! 📦");
    }
});

cardboard.connect();
```
