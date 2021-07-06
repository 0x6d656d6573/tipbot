const {Command}    = require('discord-akairo')
const {React, XYA} = require('../utils')
const table        = require('text-table')

class PriceCommand extends Command
{
    constructor()
    {
        super('price', {
            aliases: ['price', 'stats', 'statistics'],
        })
    }

    async exec(message)
    {
        await React.processing(message)

        const viperInfo = await XYA.viperInfo()
        // const onePrice          = await XYA.onePrice()
        const onePrice  = await XYA.tempPrice() // TEMP
        // const usdPrice          = parseFloat(viperInfo.token1Price) * parseFloat(onePrice)
        const usdPrice          = parseFloat(onePrice) * parseFloat(onePrice) // TEMP
        const circulatingSupply = await XYA.circulatingSupply()
        const totalSupply       = await XYA.totalSupply()
        // const volume            = await XYA.volume()

        const rows = [
            // ['ONE', `${parseFloat(viperInfo.token1Price).toFixed(6)} ONE`],
            ['ONE', `${parseFloat(onePrice).toFixed(6)} ONE`], // TEMP
            ['USD', `$${parseFloat(usdPrice).toFixed(6)}`],
            null,
            ['Mkt Cap', `$${new Intl.NumberFormat().format(parseFloat(circulatingSupply * usdPrice).toFixed(6))}`],
            // ['Volume', `$${new Intl.NumberFormat().format(volume)}`],
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
            .setColor('#1DB151')
            .setTitle(`XYA`)
            .setThumbnail('https://freyala.com/images/logo.png')
            .setDescription('```' + table(tableRows) + '```')
            // .setFooter('Source: Viperswap')
            .setFooter('Source: Mochiswap') // TEMP
        await message.channel.send(embed)
    }
}

module.exports = PriceCommand