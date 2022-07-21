const fs = require('node:fs')
const path = require('node:path')

// Require the necessary parts for running the client
const { Client, Collection, Intents } = require('discord.js')
const { token, sfConsumerKey, sfConsumerSecret, sfUserName, sfPassword, sfSecurityToken } = require('./config.json')

// Create the client instance
const client = new Client({ intents : [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] })

// Add the commands to the client
client.commands = new Collection()
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for(const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    client.commands.set(command.data.name, command)
}

// handle events
const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

for(const file of eventFiles) {
    const filePath = path.join(eventsPath, file)
    const event = require(filePath)
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

// get salesforce access token

fetch('https://login.salesforce.com/services/oauth2/token', {
    method  : 'POST',
    headers : {
        'Content-Type' : 'application/x-www-form-urlencoded',
    },
    body    :
        'grant_type=password' +
        `&client_id=${sfConsumerKey}` +
        `&client_secret=${sfConsumerSecret}` +
        `&username=${sfUserName}` +
        `&password=${sfPassword}${sfSecurityToken}`
})  .then(response => response.json())
    .then(data => {
        console.log('success', data)
        client.sf = data
    })
    .catch((error) => {
        console.log('Error: ', error)
    })

client.leadNum = 0

// login to discord with the client token
client.login(token)