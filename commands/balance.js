const {SlashCommandBuilder}            = require('@discordjs/builders')
const {Wallet, React, Config, Staking} = require("../utils")
const table                            = require('text-table')
const {MessageEmbed}                   = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription(`Shows your wallet's balance`),

    async execute(interaction)
    {
        // Defer reply
        await interaction.deferReply({ephemeral: true})

        // Checks
        if (!await Wallet.check(interaction)) {
            return await React.error(interaction, `No wallet`, `You have to tipping wallet yet. Please use the \`${Config.get('prefix')}deposit\` to create a new wallet`, true)
        }

        // Get balances and create table rows
        const wallet     = await Wallet.get(interaction, interaction.user.id)
        const gasBalance = await Wallet.gasBalance(wallet)

        let rows = []

        for (const key in Config.get('tokens')) {
            const balance = await Wallet.balance(wallet, key)
            rows.push([Config.get(`tokens.${key}.symbol`), `${balance} ${Config.get(`tokens.${key}.symbol`)}`])
        }

        rows.push(null)
        rows.push([`ONE`, `${gasBalance} ONE`])
        rows.push(null)

        if (process.env.ENVIRONMENT === 'production') {
            if (await Staking.status(wallet.address)) {
                const balance       = await Staking.balance(wallet.address)
                const rewardBalance = await Staking.rewardBalance(wallet.address)

                rows.push([`Staked ${Config.get(`token.symbol`)}`, `${balance} ${Config.get(`token.symbol`)}`])
                rows.push([`Staking rewards`, `${rewardBalance} ${Config.get(`token.symbol`)}`])
            }
        }

        const tableRows = []
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] === null) {
                tableRows.push([])
            } else {
                tableRows.push([rows[i][0], ':', rows[i][1]])
            }
        }

        // Send embed
        const embed = new MessageEmbed()
            .setColor(Config.get('colors.primary'))
            .setThumbnail(Config.get('token.thumbnail'))
            .setTitle(`Your balances`)
            .setDescription('```' + table(tableRows) + '```')

        await interaction.editReply({embeds: [embed], ephemeral: true})
    },
}