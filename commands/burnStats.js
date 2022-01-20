const {SlashCommandBuilder}    = require('@discordjs/builders')
const table                    = require('text-table')
const {Config, BurnStatistics} = require('../utils')
const {MessageEmbed}           = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`burn-statistics`)
        .setDescription(`Displays the burning stats top 10`),

    async execute(interaction)
    {
        // Defer reply
        await interaction.deferReply({ephemeral: false});

        // Gather data
        const topTen = await BurnStatistics.getBurnersTopTen()
        const total  = await BurnStatistics.getBurnTotal()
        const author = await BurnStatistics.getUserBurnAmount(interaction.user.username)

        // Build table
        const totalRows  = [[
            total,
            Config.get('token.symbol')
        ]]
        const authorRows = [[
            interaction.user.username,
            author,
            Config.get('token.symbol')
        ]]
        let topTenRows   = []
        for (let i = 0; i < topTen.length; i++) {
            topTenRows.push([
                i + 1,
                topTen[i].username,
                parseFloat(topTen[i].amount).toFixed(2),
                Config.get('token.symbol'),
            ])
        }

        // Send embed
        const embed = new MessageEmbed()
            .setColor(Config.get('colors.primary'))
            .setThumbnail(Config.get('token.thumbnail'))
            .setTitle(`🔥 Burn Statistics`)
            .addField(`Total burned`, '```' + table(totalRows) + '```')
            .addField(`Top Ten Burners`, '```' + table(topTenRows) + '```')
            .addField(`You`, '```' + table(authorRows) + '```')
        await interaction.editReply({embeds: [embed], ephemeral: false})
    },
}