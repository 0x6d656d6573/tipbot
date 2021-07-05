const {Command} = require('discord-akairo')

class PingCommand extends Command
{
    constructor()
    {
        super('ping', {
            aliases: ['ping', 'foo'],
        })
    }

    async exec(message)
    {
        console.log(this.aliases) // REMOVE
        await message.reply(`Pong!`)
    }
}

module.exports = PingCommand