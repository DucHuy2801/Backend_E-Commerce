'use strict'

const { Client, GatewayIntentBits } = require("discord.js")
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on('ready', () => {
    console.log(`Logged is as ${client.user.tag}!`)
})

const token = 'MTIyMjIxODg3ODczMDM3NTI2OQ.GhgB8N.J5SzgfPT34li_A8ZbdUuxD5WYaROZVhLZG-fb0'
client.login(token)

client.on('messageCreate', msg => {
    if (msg.author.bot) return;
    if (msg.content === 'hello') {
        msg.reply(`Hello!`)
    }
})