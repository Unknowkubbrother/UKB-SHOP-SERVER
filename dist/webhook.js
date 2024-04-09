"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discordwebhook = void 0;
const discord_js_1 = require("discord.js");
require('dotenv').config();
const Discordwebhook = async (nameScript, ipaddress, username, webhook) => {
    const webhookSplit = webhook.split('/');
    const webhookClient = new discord_js_1.WebhookClient({
        id: webhookSplit[5],
        token: webhookSplit[6]
    });
    await webhookClient.sendSlackMessage({
        'username': "UKB-DEVELOPER",
        'attachments': [{
                'color': '#FF0000', // Replace with desired color code
                'title': `**Active License**`,
                'text': `**ScriptName : ${nameScript}**`,
                'fields': [{
                        'title': 'IP Address',
                        'value': ipaddress,
                        'short': true
                    },
                    {
                        'title': 'Username',
                        'value': username,
                        'short': true
                    }
                ],
                'footer_icon': 'https://media.discordapp.net/attachments/1133807349266653264/1176607928325787649/IMG-100000000.jpg?ex=661ed406&is=660c5f06&hm=6d689fabccd0a20c3498c8f6054b858972ad04cd3b20a12940ad728e5db1e542&=&format=webp&width=1118&height=671',
                'footer': 'UKB-DEVELOPER',
                'ts': Date.now() / 1000
            }]
    }).catch(console.error);
    console.log('Webhook sented!');
};
exports.Discordwebhook = Discordwebhook;
//# sourceMappingURL=webhook.js.map