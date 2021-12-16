const {Command} = require('discord-akairo')
const {React}   = require('../utils')

class DegenCommand extends Command
{
    constructor()
    {
        super('degen', {
            aliases  : ['slarp', 'slurp', 'dip', 'rug', 'rugpull', 'burnall'],
            ratelimit: 1,
        })
    }

    async exec(message)
    {
        if (message.channel.id === '855335818155917325') {
            await React.success(this, message)
        }
    }
}

module.exports = DegenCommand