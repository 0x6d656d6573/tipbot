// Require the necessary discord.js classes
require('dotenv').config()
const fs                            = require('fs')
const {Client, Collection, Intents} = require('discord.js')
const {Token, Config, DB, React}    = require('./utils')

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES
    ],
    partials: ['GUILD_MESSAGES', 'GUILDS', 'GUILD_MESSAGE_REACTIONS', 'USER', 'GUILD_MEMBER'],
})

client.commands    = new Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command)
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) return

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        return await React.error(interaction, `An error has occurred`, `Please contact ${Config.get('error_reporting_users')}`, true)
    }
})

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN).then(async () => {
    console.log('Ready!')

    DB.syncDatabase()

    // Guild: 855335818155917322
    // Channel: 855335818155917325
    // Message: 931488340543430696

    // client.channels.fetch('855335818155917325').then(channel => {
    //     channel.messages.fetch()
    //     console.log(channel.name); // REMOVE
    //
    //     channel.messages.fetch('931488340543430696').then(message => {
    //         console.log(message.content); // REMOVE
    //
    //         const collector = message.createReactionCollector()
    //
    //         collector.on('collect', (reaction, user) => {
    //             console.log('foo'); // REMOVE
    //             // console.log(`Collected ${reaction.emoji.name} from ${user.tag}`)
    //         })
    //     })
    // })

    await getPrice()
    await setPresence()
    setInterval(getPrice, 60000)
    setInterval(setPresence, 5000)
})

// Set price presence
let priceUsd = 0
let priceOne = 0
let presence = 'usd'

async function setPresence()
{
    if (presence === 'usd') {
        await client.user.setPresence({activities: [{name: `${Config.get('token.symbol')} at ${priceOne} ONE`, type: 3}]})

        presence = 'one'
    } else {
        await client.user.setPresence({activities: [{name: `${Config.get('token.symbol')} at $${priceUsd}`, type: 3}]})

        presence = 'usd'
    }
}

async function getPrice()
{
    const tokenPrice = await Token.tokenPrice()
    const onePrice   = await Token.onePrice()
    const priceInOne = tokenPrice.usd / onePrice

    priceUsd = parseFloat(tokenPrice.usd).toFixed(3)
    priceOne = parseFloat(priceInOne).toFixed(3)
}