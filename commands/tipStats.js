const {Command}       = require('discord-akairo')
const table           = require('text-table')
const {TipStatistics} = require('../utils')

class TipstatsCommand extends Command
{
    constructor()
    {
        super('tipstats', {
            aliases  : ['tipstats', 'tipstatistics'],
            ratelimit: 2,
        })
    }

    async exec(message, args)
    {
        const topTen = await TipStatistics.getTippersTopTen()
        const total  = await TipStatistics.getTipTotal()
        const author = await TipStatistics.getUserTipAmount(message.author.username)

        const totalRows  = [[
            new Intl.NumberFormat().format(total),
            process.env.SYMBOL
        ]]
        const authorRows = [[
            message.author.username,
            new Intl.NumberFormat().format(author),
            process.env.SYMBOL
        ]]
        let topTenRows   = []
        for (let i = 0; i < topTen.length; i++) {
            topTenRows.push([
                i + 1,
                topTen[i].username,
                new Intl.NumberFormat().format(parseFloat(topTen[i].amount).toFixed(2)),
                process.env.SYMBOL,
            ])
        }

        const embed = this.client.util.embed()
            .setColor('#1DB151')
            .setTitle(`💵 Tip Statistics`)
            .addField(`Total tipped`, '```' + table(totalRows) + '```')
            .addField(`Top Ten Tippers`, '```' + table(topTenRows) + '```')
            .addField(`You`, '```' + table(authorRows) + '```')

        await message.channel.send(embed)
    }
}

module.exports = TipstatsCommand