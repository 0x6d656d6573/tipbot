const {Command}        = require('discord-akairo')
const table            = require('text-table')
const {BurnStatistics} = require('../utils')

class BurnstatsCommand extends Command
{
    constructor()
    {
        super('burnstats', {
            aliases  : ['burnstats', 'burnstatistics'],
            channel  : 'guild',
            ratelimit: 1,
        })
    }

    async exec(message, args)
    {
        const topTen = await BurnStatistics.getBurnersTopTen()
        const total  = await BurnStatistics.getBurnTotal()
        const author = await BurnStatistics.getUserBurnAmount(message.author.username)

        const totalRows  = [[
            total,
            process.env.SYMBOL
        ]]
        const authorRows = [[
            message.author.username,
            author,
            process.env.SYMBOL
        ]]
        let topTenRows   = []
        for (let i = 0; i < topTen.length; i++) {
            topTenRows.push([
                i + 1,
                topTen[i].username,
                parseFloat(topTen[i].amount).toFixed(2),
                process.env.SYMBOL,
            ])
        }

        const embed = this.client.util.embed()
            .setColor('#7fca49')
            .setTitle(`🔥 Burn Statistics`)
            .addField(`Total burned`, '```' + table(totalRows) + '```')
            .addField(`Top Ten Burners`, '```' + table(topTenRows) + '```')
            .addField(`You`, '```' + table(authorRows) + '```')

        await message.channel.send(embed)
    }
}

module.exports = BurnstatsCommand