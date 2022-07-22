require("dotenv").config(); // Dont ENV

/* Discord */
const { MessageEmbed, WebhookClient } = require('discord.js');

const webhookClient = new WebhookClient({url : process.env.WEBHOOK_URL});

/* OS */
const find = require('find-process');
const pidusage = require("pidusage");
const os = require("os");
const cron = require('node-cron');

function formatBytes(a,b=2,k=1024){with(Math){let d=floor(log(a)/log(k));return 0==a?"0 Bytes":parseFloat((a/pow(k,d)).toFixed(max(0,b)))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}}

FindProcess();
cron.schedule('* * * * *', () =>  { // Run Every Minute
    FindProcess();
});

function FindProcess()
{
    console.log("Find Process");
    find('name', process.env.PROCESS_NAME)
    .then(function (list) {
        const embed = new MessageEmbed()
                .setTitle('Server Resource')
                .setColor('#0099ff');
        if (!list.length) {
            embed
                .addField("Process ID", "Process Is Not Running")
                .addField("CPU", "0%")
                .addField("RAM", `0 / ${formatBytes(os.totalmem())}`)
                .setTimestamp()

            webhookClient.editMessage(process.env.WEBHOOK_MESSAGE_ID, {
                username: process.env.WEBHOOK_NAME,
                avatarURL: process.env.WEBHOOK_PROFILE,
                embeds: [embed],
            });
            console.log("Webhook Send (OFF)");
        }
        else
        {
            pidusage(list[0].pid, function(err, stats) {
                embed
                    .addField("Process ID", list[0].pid.toString())
                    .addField("CPU", Math.round(stats.cpu) + "%")
                    .addField("RAM", `${formatBytes(stats.memory)} / ${formatBytes(os.totalmem())}`)
                    .setTimestamp()

                webhookClient.editMessage(process.env.WEBHOOK_MESSAGE_ID, {
                    username: process.env.WEBHOOK_NAME,
                    avatarURL: process.env.WEBHOOK_PROFILE,
                    embeds: [embed],
                });
                console.log("Webhook Send (ON)");
            })
        }
    });
}