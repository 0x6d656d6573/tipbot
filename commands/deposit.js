const {SlashCommandBuilder}   = require('@discordjs/builders')
const {Wallet, React, Config} = require("../utils")
const table                   = require('text-table')
const {MessageEmbed}          = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription(`Shows your wallet address. If you have no wallet yet a new one will be created for you`),

    async execute(interaction)
    {
        // Gather data
        const wallet = await Wallet.get(interaction, interaction.user.id)

        let tokensSummary = ''
        let i             = 1
        for (const [key, token] of Object.entries(Config.get('tokens'))) {
            if (i++ === Object.entries(Config.get('tokens')).length) {
                tokensSummary += ` or ${token.symbol}`
            } else {
                tokensSummary += ` ${token.symbol},`
            }
        }

        // Send embeds
        const disclaimer = new MessageEmbed()
            .setColor(Config.get('colors.warning'))
            .setTitle(`:warning: Disclaimer`)
            .setDescription(`Please do not use this as your main wallet, only for tipping on Discord. Do not deposit large amounts of ${Config.get('token.symbol')} to this wallet. Use this wallet at your own risk!`)

        const address = new MessageEmbed()
            .setColor(Config.get('colors.primary'))
            .setThumbnail(Config.get('token.thumbnail'))
            .setTitle(`Your wallet address`)
            .setDescription('```' + wallet.address + '```')
            .addField(`Add funds`, `To add funds to this wallet, go to your main wallet and send some ${tokensSummary} to this address. To confirm the transaction, you can check your balance using the \`${Config.get('prefix')}balance\` command. Have fun tipping!`)
            .addField(`Gas`, `In order to pay network fee you need to deposit a small amount of ONE too. 1 ONE should last you 4000 transactions. \n\n Don't have 1 ONE? Don't worry, you can use the \`${Config.get('prefix')}getgas\` command and get some gas on the house to get you started!`)

        await interaction.reply({embeds: [disclaimer, address], ephemeral: true})
    },
}