const {Command} = require('discord-akairo')
const {Config}  = require('../utils')
const git       = require('git-rev-sync')

class VersionCommand extends Command
{
    constructor()
    {
        super('version', {
            aliases  : ['version', 'v'],
            ratelimit: 1,
        })
    }

    async exec(message)
    {
        const embed = this.client.util.embed()
            .setColor(Config.get('colors.primary'))
            // .attachFiles('images/logo.png')
            // .setThumbnail('attachment://logo.png')
            .setTitle(`Sir Reginald version`)
            .setDescription('```' + git.tag(false) + '```')
        await message.reply(embed)
    }
}

module.exports = VersionCommand