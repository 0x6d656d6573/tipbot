const {gitDescribeSync} = require("git-describe")
const {Command}         = require('discord-akairo')

class PingCommand extends Command
{
    constructor()
    {
        super('version', {
            aliases: ['version', 'v'],
        })
    }

    async exec(message)
    {
        const gitInfo = gitDescribeSync()

        const embed = this.client.util.embed()
            .setColor('1DB151')
            .setTitle(`${process.env.SYMBOL} Tipbot version`)
        if (gitInfo.semver === null) {
            embed.setDescription('```1.0.0-beta-' + gitInfo.raw + '```')
        } else {
            embed.setDescription('```' + gitInfo.raw + '```')
        }
        await message.reply(embed)
    }
}

module.exports = PingCommand