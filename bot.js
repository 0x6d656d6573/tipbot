require('dotenv').config()
const {AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler} = require('discord-akairo')
const {Config, DB, Token}                                               = require('./utils')

class BotClient extends AkairoClient
{
    constructor()
    {
        super({
            ownerID: Config.get('owner_ids')
        })

        /* Command handler */
        this.commandHandler = new CommandHandler(this, {
            directory      : './commands/',
            prefix         : Config.get('prefix'),
            defaultCooldown: Config.get('cooldown'),
        })

        /* Inhibitor handler */
        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: './inhibitors/'
        })
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler)

        /* Listener handler */
        this.listenerHandler = new ListenerHandler(this, {
            directory: './listeners/'
        })
        this.listenerHandler.setEmitters({
            commandHandler  : this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler : this.listenerHandler,
        })
        this.commandHandler.useListenerHandler(this.listenerHandler)

        /* Load handlers */
        this.inhibitorHandler.loadAll()
        this.listenerHandler.loadAll()
        this.commandHandler.loadAll()
    }
}

const client = new BotClient()
client.login(process.env.TOKEN)

client.on('ready', () => {
    DB.syncDatabase()

    getPrice()
    setPresence()
    setInterval(getPrice, 60000)
    setInterval(setPresence, 5000)
})

let priceUsd = 0
let priceOne = 0
let presence = 'usd'

async function setPresence()
{
    if (presence === 'usd') {
        await client.user.setPresence({activity: {name: `${Config.get('token.symbol')} at ${priceOne} ONE`, type: 3}})

        presence = 'one'
    } else {
        await client.user.setPresence({activity: {name: `${Config.get('token.symbol')} at $${priceUsd}`, type: 3}})

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

client.on("guildMemberAdd", async (member) => {
    const intOne              = Math.floor(Math.random() * (5 - 1 + 1) + 1)
    const intTwo              = Math.floor(Math.random() * (5 - 1 + 1) + 1)
    const answer              = parseInt(intOne) + parseInt(intTwo)
    const verificationChannel = client.channels.cache.get(Config.get('channels.verification'))

    const embed = client.util.embed()
        .setColor(Config.get('colors.primary'))
        .setTitle(`Welcome to Freyala!`)
        .setDescription(`Hi <@${member.user.id}>! Please answer the following question to gain access to the server.`)
        .setImage(`http://placehold.it/500x100/374151/FFFFFF?text=${intOne}%2B${intTwo}=%3F`)

    const msg = await verificationChannel.send(embed)

    const filter = function (response) {
        return response.author.id === member.user.id && parseInt(response.content) === answer
    }

    msg.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
        .then(async collected => {
            const role = member.guild.roles.cache.find(role => role.name === 'Freyfolk')
            await member.roles.add(role)

            const embed = client.util.embed()
                .setColor(Config.get('colors.primary'))
                .setTitle(`Thank you ${member.user.username}!`)
                .setDescription(`You are now officially one of us! Introduce yourself to the other Freyfolk and have an amazing time.`)
            await member.user.send(embed)

            msg.delete()
        })
        .catch(async () => {
            const embed = client.util.embed()
                .setColor(Config.get('colors.error'))
                .setTitle(`You were kicked!`)
                .setDescription(`Because a correct answer was not given or not given on time, you have been kicked from the Freyala server.`)
            await member.user.send(embed)

            await member.kick('Kicked by Sir reginald')

            msg.delete()
        })
})
