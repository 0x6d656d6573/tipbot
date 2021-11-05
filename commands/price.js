const {Command}              = require('discord-akairo')
const {Config, React, Token} = require('../utils')
const table                  = require('text-table')
const moment                 = require('moment')

class PriceCommand extends Command
{
    constructor()
    {
        super('price', {
            aliases  : ['price', 'stats', 'statistics'],
            ratelimit: 1,
        })
    }

    async exec(message)
    {
        await React.processing(message)

        const tokenPrice        = await Token.tokenPrice()
        const onePrice          = await Token.onePrice()
        const priceInOne        = tokenPrice.usd / onePrice
        const circulatingSupply = await Token.circulatingSupply()
        const stakedSupply      = await Token.stakedSupply()
        const totalSupply       = await Token.totalSupply()

        const rows = [
            ['ONE', `${parseFloat(priceInOne).toFixed(6)} ONE`],
            ['USD', `$${parseFloat(tokenPrice.usd).toFixed(6)}`],
            null,
            ['24h Change', `${parseFloat(tokenPrice.usd_24h_change).toFixed(3)}%`],
            ['24h Volume', parseFloat(tokenPrice.usd_24h_vol).toFixed(3)],
            null,
            ['Market Cap', `$${new Intl.NumberFormat().format(parseFloat(circulatingSupply * tokenPrice.usd).toFixed(0))}`],
            null,
            ['Fully Diluted', `${new Intl.NumberFormat().format(parseFloat(totalSupply).toFixed(0))}`],
            ['Circulating Supply', `${new Intl.NumberFormat().format(parseFloat(circulatingSupply).toFixed(0))}`],
            ['Staked Supply', `${new Intl.NumberFormat().format(parseFloat(stakedSupply).toFixed(0))}`],
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
        const lastUpdated = moment.duration(moment().diff(moment.unix(tokenPrice.last_updated_at)), 'milliseconds')

        const embed = this.client.util.embed()
            .setColor(Config.get('colors.primary'))
            .setTitle(Config.get('price_embed.title'))
            // .attachFiles('images/logo.png')
            // .setThumbnail('attachment://logo.png')
            .setDescription('```' + table(tableRows) + '```')
            .setFooter(Config.get('price_embed.footer'))
            .addField(`Last updated`, `${lastUpdated.minutes()}m ${lastUpdated.seconds()}s ago`)
            .addField(`Chart`, Config.get('price_embed.chart_link'))
            .setURL(Config.get('price_embed.url'))
        await message.channel.send(embed)

        await React.message(message, 'price')
    }
}

module.exports = PriceCommand