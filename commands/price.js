const {SlashCommandBuilder}  = require('@discordjs/builders')
const {Config, React, Token} = require('../utils')
const table                  = require('text-table')
const moment                 = require('moment')
const {MessageEmbed}         = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`price`)
        .setDescription(`Displays the current ${Config.get('token.symbol')} statistics`)
        .addNumberOption(option => option.setRequired(false).setName('amount').setDescription(`Enter an amount to get it's current value`)),

    async execute(interaction)
    {
        // Options
        const amount = interaction.options.getNumber('amount')

        // Defer reply
        await interaction.deferReply({ephemeral: (amount !== null)})

        // Gather data
        const tokenPrice        = await Token.tokenPrice()
        const onePrice          = await Token.onePrice()
        let priceInOne          = tokenPrice.usd / onePrice
        let priceInUsd          = tokenPrice.usd
        const circulatingSupply = await Token.circulatingSupply()
        const stakedSupply      = await Token.stakedSupply()
        const totalSupply       = await Token.totalSupply()
        const lastUpdated       = moment.duration(moment().diff(moment.unix(tokenPrice.last_updated_at)), 'milliseconds')

        if (amount) {
            priceInUsd = priceInUsd * amount
            priceInOne = priceInUsd / onePrice
        }

        // Build table
        const rows = []
        rows.push(
            ['ONE', `${parseFloat(priceInOne).toFixed(2)} ONE`],
            ['USD', `$${parseFloat(priceInUsd).toFixed(2)}`],
        )
        if (amount === null) {
            rows.push(
                null,
                ['24h Change', `${parseFloat(tokenPrice.usd_24h_change).toFixed()}%`],
                ['24h Volume', new Intl.NumberFormat().format(parseFloat(tokenPrice.usd_24h_vol).toFixed())],
                null,
                ['Market Cap', `$${new Intl.NumberFormat().format(parseFloat((circulatingSupply * tokenPrice.usd) / 1000000).toFixed(2))}m`],
                null,
                ['Fully Diluted', `${new Intl.NumberFormat().format(parseFloat(totalSupply / 1000000).toFixed(2))}m`],
                ['Circulating Supply', `${new Intl.NumberFormat().format(parseFloat(circulatingSupply / 1000000).toFixed(2))}m`],
                ['Staked Supply', `${new Intl.NumberFormat().format(parseFloat(stakedSupply / 1000000).toFixed(2))}m`],
            )
        }

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

        // Send embed
        const embed = new MessageEmbed()
            .setColor(Config.get('colors.primary'))
            .setThumbnail(Config.get('token.thumbnail'))
            .setTitle(Config.get('price_embed.title'))
            .setDescription('```' + table(tableRows) + '```')
            .setFooter(Config.get('price_embed.footer'))
            .addField(`Last updated`, `${lastUpdated.minutes()}m ${lastUpdated.seconds()}s ago`)
            .addField(`Chart`, Config.get('price_embed.chart_link'))
            .setURL(Config.get('price_embed.url'))
        if (amount) {
            await interaction.editReply({content: `Price for ${amount} ${Config.get(`token.symbol`)}`, embeds: [embed], ephemeral: true})
        } else {
            await interaction.editReply({embeds: [embed], ephemeral: false})
        }

        await React.message(interaction, 'price')
    },
}