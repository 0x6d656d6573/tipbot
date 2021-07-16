const {Command}    = require('discord-akairo')
const {React, Token} = require('../utils')
const table        = require('text-table')

class PriceCommand extends Command
{
    constructor()
    {
        super('price', {
            aliases: ['price', 'stats', 'statistics'],
            ratelimit: 1,
        })
    }

    async exec(message)
    {
        await React.processing(message)

        const viperInfo         = await Token.viperInfo()
        const onePrice          = await Token.onePrice()
        const usdPrice          = parseFloat(viperInfo.token1Price) * parseFloat(onePrice)
        const circulatingSupply = await Token.circulatingSupply()
        const totalSupply       = await Token.totalSupply()
        const volume            = await Token.volume()

        const rows = [
            ['ONE', `${parseFloat(viperInfo.token1Price).toFixed(6)} ONE`],
            ['USD', `$${parseFloat(usdPrice).toFixed(6)}`],
            null,
            ['Mkt Cap', `$${new Intl.NumberFormat().format(parseFloat(circulatingSupply * usdPrice).toFixed(6))}`],
            ['Volume', `$${new Intl.NumberFormat().format(volume)}`],
            null,
            ['Cir Sup', `${new Intl.NumberFormat().format(parseFloat(circulatingSupply).toFixed(6))}`],
            ['Tot Sup', `${new Intl.NumberFormat().format(parseFloat(totalSupply).toFixed(6))}`],
        ]

        const tableRows = []
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === null) {
                tableRows.push([])
            } else {
                tableRows.push([
                    rows[i][0],
                    ':',
                    rows[i][1],
                ])
            }
        }

        await React.done(message)

        const embed = this.client.util.embed()
            .setColor(process.env.COLOR_PRIMARY)
            .setTitle(process.env.PRICE_EMBED_TITLE)
            .setThumbnail(process.env.PRICE_EMBED_THUMBNAIL)
            .setDescription('```' + table(tableRows) + '```')
            .setFooter(process.env.PRICE_EMBED_FOOTER)
            .addField(`Chart`, process.env.PRICE_EMBED_CHART_LINK)
            .setURL(process.env.PRICE_EMBED_URL)
        await message.channel.send(embed)
    }
}

module.exports = PriceCommand