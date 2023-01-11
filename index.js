const discord = require("discord.js")
const ghCore = require("@actions/core");
const fs = require("fs");

function getActionEnv({ key, defaultValue = null, required = false }) {
    if (process.env[key]) {
        return process.env[key];
    }
    if (process.env[`INPUT_${key}`]) {
        return process.env[`INPUT_${key}`];
    }
    if (required) {
        const msg = `key=(${key}) not found`;
        ghCore.setFailed(msg);
        process.exit(1);
    }
    return defaultValue;
}

const client = new discord.Client({ intents: [discord.GatewayIntentBits.Guilds] });
client.once(discord.Events.ClientReady, async c => {
    const channel = await c.channels.fetch(getActionEnv({ key: "DISCORD_CHANNEL", required: true }));
    const msgId = getActionEnv({ key: "DISCORD_MESSAGE", defaultValue: channel.lastMessageId });
    const postFilePath = getActionEnv({ key: "POST_FILE", defaultValue: "/etc/discord-post/post" })

    const data = fs.readFileSync(postFilePath);
    const messagePayload = data.toString();

    let body = { content: discord.escapeMarkdown(messagePayload) };
    if (msgId && msgId != 'new') {
        const msg = await channel.messages.fetch(msgId);
        await msg.edit(body)
    } else {
        await channel.send(body)
    }
    console.log("done")
    process.exit(0);
});

const token = getActionEnv({ key: 'DISCORD_TOKEN', required: true });
client.login(token);
