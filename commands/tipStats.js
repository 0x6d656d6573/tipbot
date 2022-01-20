const {SlashCommandBuilder}    = require('@discordjs/builders')
const table                                          = require('text-table')
const {Config, BurnStatistics, TipStatistics, Token} = require('../utils')
const {MessageEmbed}                                 = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`tip-statistics`)
        .setDescription(`Display the tipping stats top 10`),

    async execute(interaction)
    {
        // Defer reply
        await interaction.deferReply({ephemeral: false});

        // Gather data
        const topTen     = await TipStatistics.getTippersTopTen()
        const total      = await TipStatistics.getTipTotal()
        const tokenPrice = await Token.tokenPrice()
        const author     = await TipStatistics.getUserTipAmount(interaction.user.username)

        // Build table
        const totalRows  = [
            [
                new Intl.NumberFormat().format(total) + ' '  + Config.get('token.symbol')
            ],
            [
                '$' + new Intl.NumberFormat().format(total * tokenPrice.usd),
            ]
        ]
        const authorRows = [[
            interaction.user.username,
            new Intl.NumberFormat().format(author),
            Config.get('token.symbol')
        ]]
        let topTenRows   = []
        for (let i = 0; i < topTen.length; i++) {
            topTenRows.push([
                i + 1,
                topTen[i].username,
                new Intl.NumberFormat().format(parseFloat(topTen[i].amount).toFixed(2)),
                Config.get('token.symbol'),
            ])
        }

        // Send embed
        const embed = new MessageEmbed()
            .setColor(Config.get('colors.primary'))
            .setThumbnail(Config.get('token.thumbnail'))
            .setTitle(`💵 Tip Statistics`)
            .addField(`Total tipped`, '```' + table(totalRows) + '```')
            .addField(`Top Ten Tippers`, '```' + table(topTenRows) + '```')
            .addField(`You`, '```' + table(authorRows) + '```')
        await interaction.editReply({embeds: [embed], ephemeral: false})
    },
}

