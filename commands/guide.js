const {Command}       = require('discord-akairo')
const {React} = require('../utils')

class GuideCommand extends Command
{
    constructor()
    {
        super('guide', {
            aliases  : ['guide', 'docs', 'doc'],
            channel  : 'guild',
            ratelimit: 1
        })
    }

    async exec(message, args)
    {
        const users  = message.mentions.users.filter(function (user) {
            return !user.bot
        })
        const member = users.first() ? users.first() : message.author

        await message.channel.send(`Hi there <@${member.id}>, May I recommend visiting our City Tour Guide: https://docs.freyala.com/freyala`)
    }
}

module.exports = GuideCommand