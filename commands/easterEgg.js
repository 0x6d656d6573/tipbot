const {Command} = require('discord-akairo')

class EasterEggCommand extends Command
{
    constructor()
    {
        super('easteregg', {
            aliases: ['easteregg'],
        })
    }

    async exec(message)
    {
        await message.react(`🥚`)
    }
}

module.exports = EasterEggCommand