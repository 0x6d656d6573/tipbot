const {SlashCommandBuilder} = require('@discordjs/builders')
const {Config, React}       = require('../utils')
const table                 = require('text-table')
const {MessageEmbed}        = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('legends')
        .setDescription(`Display the legendary bèta tipping top 10`),
    
    async execute(interaction)
    {
        // Gather data
        const topTen = [
            {username: 'Failapotmaus', amount: 176925.00},
            {username: '||`__TheerapakG__||', amount: 69696.90},
            {username: 'Tailchakra', amount: 56540.10},
            {username: 'ShimmyShine', amount: 50736.20},
            {username: 'Inertia', amount: 21358.80},
            {username: 'GatoCatto', amount: 11717.60},
            {username: 'Prozex', amount: 11507.70},
            {username: 'Bourbin', amount: 10610.40},
            {username: 'ArtMom', amount: 10296.40},
            {username: 'Gyd0x', amount: 9111.11},
        ]

        let topTenRows = []
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
            .setTitle(`🦸 Legendary Bèta Tippers`)
            .addField(`Top Ten Tippers`, '```' + table(topTenRows) + '```')

        await interaction.reply({embeds: [embed], ephemeral: false})
    },
}