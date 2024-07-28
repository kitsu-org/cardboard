# Cardboard 📦
Cardboard is a module that allows you to easily work with misskey, with a focus on Sharkey. 

No dependencies, strictly typed, and looking quite stylish!

## Example
```js
import { CardboardClient } from '@kitsu-org/cardboard';
const cardboard = new CardboardClient("kitsunes.club", "yourkeyhere");

cardboard.on("ready", async () => {
    cardboard.log("Ready!")
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

## installation
Installing cardboard is easy! You can install cardboard by including it into your project, like so!
```bash
# Install the stable version of cardboard
bun add @kitsu-org/cardboard
```

If you want to use the cutting edge version, you can install it through git.
> ⚠️ You should keep in mind that reliability will not be _great_ if you use this method, but you'll get more features.
```bash
# Install the development edition
bun add github:kitsu-org/cardboard
```