// Require the necessary discord.js classes
require('dotenv').config()
const fs                                          = require('fs')
const {Client, Collection, Intents, MessageEmbed} = require('discord.js')
const {Token, Config, DB, React}                  = require('./utils')

const {ETwitterStreamEvent, TweetStream, TwitterApi, ETwitterApiError} = require('twitter-api-v2')
const moment                                                           = require("moment")
const {Op}                                                             = require("sequelize")
const Log                                                              = require("./utils/Log")
const {long}                                                           = require("git-rev-sync")

// Create a new client instance
const client = new Client({
    intents : [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS
    ],
    partials: ['GUILD_MESSAGES', 'GUILDS', 'GUILD_MESSAGE_REACTIONS', 'USER', 'GUILD_MEMBER', 'GUILD_MEMBERS'],
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

// Greet new members
client.on('guildMemberAdd', member => {
    client.channels.fetch(Config.get('channels.general')).then(channel => {
        channel.send(`Hi there <@${member.id}>, Welcome to Freyala! May I recommend visiting our City Tour Guide: https://docs.freyala.com/freyala`)
    })
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

    await twitterFeed(client)
    await sendReminders()
    await getPrice()
    await setPresence()
    setInterval(sendReminders, 30000)
    setInterval(getPrice, 60000)
    setInterval(setPresence, 5000)
})

// Start Twitter stream
async function twitterFeed(client)
{
    const channel       = await client.channels.cache.get(process.env.TWITTER_CHANNEL)
    const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN)

    // Get and delete old rules if needed
    const rules = await twitterClient.v2.streamRules()
    if (rules.data?.length) {
        await twitterClient.v2.updateStreamRules({
            delete: {ids: rules.data.map(rule => rule.id)},
        })
    }

    // Add our rules
    await twitterClient.v2.updateStreamRules({
        add: [{value: `from:${process.env.TWITTER_HANDLE}`}],
    })

    const rules2 = await twitterClient.v2.streamRules()
    console.log(rules2.data.map(rule => rule))

    const stream = await twitterClient.v2.searchStream({
        'tweet.fields': ['author_id', 'attachments'],
        'media.fields': ['duration_ms', 'height', 'media_key', 'preview_image_url', 'public_metrics', 'type', 'url', 'width', 'alt_text'],
        'expansions'  : ['attachments.media_keys'],
    })

    // Enable auto reconnect
    stream.autoReconnect = true

    stream.on(ETwitterStreamEvent.Data, async tweet => {
        const embed = new MessageEmbed()
            .setColor(Config.get('colors.primary'))
            .setThumbnail(Config.get('token.thumbnail'))
            .setDescription(tweet.data.text)
            if (tweet.includes?.media[0].url) {
                embed.setImage(tweet.includes.media[0].url)
            }

        await channel.send({content: `@everyone XYA placed a new tweet!`, embeds: [embed]})
    })
}

// Send reminders
async function sendReminders()
{
    const reminders = await DB.reminders.findAll({where: {timestamp: {[Op.lt]: moment().unix()}}})

    for (let i = 0; i < reminders.length; i++) {
        const embed = new MessageEmbed()
            .setColor(Config.get('colors.primary'))
            .setThumbnail(Config.get('token.thumbnail'))
            .setTitle(`Let me remind you of`)
            .setDescription(reminders[i].message)

        await client.users.cache.get(reminders[i].user).send({embeds: [embed]})

        await DB.reminders.destroy({where: {id: reminders[i].id}})
    }
}

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