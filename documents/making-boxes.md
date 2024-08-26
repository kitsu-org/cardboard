---
title: Boxes
group: Documents
---

# Boxes
Now that you have created a simple bot using cardboard, it's time to try making a box!

## What's a Box?

Boxes are Cardboard's "plugins" or "cogs" as you might recognize them. When something happens, each box will be given a copy of that event to do what they need.

> ⚠️ **You should always read through a box's code before you install it!**
>
> Never run compiled or obfuscated boxes. They're a quick way to make bad things happen; like giving account access to a third party, eating your snacks, or using your toaster.

## How do I make a box?
To make a box, you should *extend* the Box class, in the `src/BoxHelper.ts` file. That's a great way to know what you're going to get from the module.

The general gist should be a starter file that looks a bit like this:

`boxes/myCoolCommand.js`
```js
import { Box } from "@kitsu-org/cardboard"
export default class myCoolCommand extends Box {

    onStartup() {
        console.log("My cool command has started! Awesome!")
    }

    async onMention (note) {
        if (note.content.includes("hello cardboard")) {
            console.log("I got a note!")
            await note.reply("hi! 📦")
        }
    }
}
```
> It's important that you always export the command you made as a **default** class. Cardboard is very particular about this!


Now that you have a box created, it's important for us to tell cardboard to load those boxes into memory, or it won't recognize that you made them. There's a few ways to achieve this, but as you might have noticed, we've put the cool command into the folder "boxes" - so we're just going to have cardboard take a peek in the boxes directory and load all of the boxes there. We'll create a simple Cardboard bot that'll do this!

``index.js``
```js

import {CardboardClient} from "@kitsu-org/cardboard"
import {join} from "node:path"
const cardboard = new CardboardClient(process.env.INSTANCE, process.env.API_KEY);

cardboard.logger.log("loading!")

cardboard.on("ready", () => {
    cardboard.logger.log("Ready!");
});


cardboard.addFolder(join(__dirname, "boxes"));
cardboard.connect();

```

now, when you run ``node --env-file=.env index.js``, you should see that your box was loaded. If you message yourself from another account, you should promptly get a reply!

Congrats! You've made your first box! 👏 Now, get out there and explore the world of Cardboard! 📦