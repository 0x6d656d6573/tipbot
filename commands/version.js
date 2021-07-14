const git = require('git-rev-sync')

const {Command} = require('discord-akairo')

class PingCommand extends Command
{
    constructor()
    {
        super('version', {
            aliases: ['version', 'v'],
            ratelimit: 1,
        })
    }

    async exec(message)
    {
        const embed = this.client.util.embed()
            .setColor(process.env.COLOR_PRIMARY)
            .setTitle(`${process.env.SYMBOL} Tipbot version`)
            .setDescription('```' + git.tag(false) + '```')
        await message.reply(embed)
    }
}

module.exports = PingCommand