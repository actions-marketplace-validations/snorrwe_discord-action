/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 94:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 77:
/***/ ((module) => {

module.exports = eval("require")("discord.js");


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const discord = __nccwpck_require__(77);
const ghCore = __nccwpck_require__(94);
const fs = __nccwpck_require__(147);

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

const client = new discord.Client({
    intents: [discord.GatewayIntentBits.Guilds],
});
client.once(discord.Events.ClientReady, async (c) => {
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

    const data = fs.readFileSync(postFilePath);
    const messagePayload = data.toString();

    let body = { content: discord.escapeMarkdown(messagePayload) };
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

})();

module.exports = __webpack_exports__;
/******/ })()
;