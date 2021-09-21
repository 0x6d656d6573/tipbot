const {Command}       = require('discord-akairo')
const {Config, React} = require('../utils')

class DegenCommand extends Command
{
    constructor()
    {
        super('degen', {
            aliases  : ['slarp', 'slurp', 'dip', 'rug', 'rugpull', 'burnall'],
            ratelimit: 1,
        })
    }

    async exec(message, alias)
    {
        if (message.channel.name === '🤪degen-chat') {
            if (message.content === `${Config.get('prefix')}slarp` && Math.floor(Math.random() * 20) === 1) {
                await message.reply(`Skol! 🍻🤤`)
            } else {
               await React.success(this, message)
            }
        }
    }
}

module.exports = DegenCommand