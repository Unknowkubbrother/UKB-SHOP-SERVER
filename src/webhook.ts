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
            'color': '#009cff', // Replace with desired color code
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
            // <--> ลดการทำงานของwebhook
            // 'image_url': 'https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?fit=476%2C280&ssl=1',
            // 'footer_icon': 'https://media.discordapp.net/attachments/1133807349266653264/1176607928325787649/IMG-100000000.jpg?ex=661ed406&is=660c5f06&hm=6d689fabccd0a20c3498c8f6054b858972ad04cd3b20a12940ad728e5db1e542&=&format=webp&width=1118&height=671',
            // <-->
            'footer': 'UKB-DEVELOPER',
            'ts': Date.now() / 1_000
        }]
    }).catch(console.error);
    console.log('Webhook sented!');
}