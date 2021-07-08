const {Command} = require('discord-akairo')
const {React}   = require('../utils')

class DegenCommand extends Command
{
    constructor()
    {
        super('degen', {
            aliases  : ['slarp', 'slurp', 'dip', 'rug', 'rugpull', 'burnall'],
            ratelimit: 2,
        })
    }

    async exec(message)
    {
        if (message.channel.name === '🤪degen-chat') {
            await React.success(this, message)
        }
    }
}

module.exports = DegenCommand