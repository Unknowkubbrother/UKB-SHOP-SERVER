import { WebhookClient } from 'discord.js';

require('dotenv').config();

export const Discordwebhook = async (nameScript:string,ipaddress:string,username:string,webhook:string) => {
    const webhookSplit = webhook.split('/');
    const webhookClient = new WebhookClient({
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
            'footer': 'UKB-DEVELOPER',
            'ts': Date.now() / 1_000
        }]
    }).catch(console.error);
    console.log('Webhook sented!');
}