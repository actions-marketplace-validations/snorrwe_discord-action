import { Client, GatewayIntentBits, Events, escapeMarkdown } from "discord.js";
import { setFailed } from "@actions/core";
import { readFileSync } from "fs";

function getActionEnv({ key, defaultValue = null, required = false }) {
    if (process.env[key]) {
        return process.env[key];
    }
    if (process.env[`INPUT_${key}`]) {
        return process.env[`INPUT_${key}`];
    }
    if (required) {
        const msg = `key=(${key}) not found`;
        setFailed(msg);
        process.exit(1);
    }
    return defaultValue;
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});
client.once(Events.ClientReady, async (c) => {
    const channel = await c.channels.fetch(
        getActionEnv({ key: "DISCORD_CHANNEL", required: true }),
    );
    const msgId = getActionEnv({
        key: "DISCORD_MESSAGE",
        defaultValue: channel.lastMessageId,
    });
    const postFilePath = getActionEnv({
        key: "POST_FILE",
        defaultValue: "/etc/discord-post/post",
    });

    const data = readFileSync(postFilePath);
    const messagePayload = data.toString();

    let body = { content: escapeMarkdown(messagePayload) };
    if (msgId && msgId != "new") {
        const msg = await channel.messages.fetch(msgId);
        await msg.edit(body);
    } else {
        const maxSize = 2000;
        const chunks = Math.ceil(body.length / maxSize);
        for (let i = 0; i < chunks; ++i) {
            const chunk = str.substr(i * maxSize, maxSize);
            await channel.send(chunk);
        }
    }
    console.log("done");
    process.exit(0);
});

const token = getActionEnv({ key: "DISCORD_TOKEN", required: true });
client.login(token);
