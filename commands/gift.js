const {SlashCommandBuilder}                           = require('@discordjs/builders')
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js")
const {Config, Transaction, Wallet, React}            = require("../utils")
const table                                           = require("text-table")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`gift`)
        .setDescription(`Place a gift that can be claimed by any channel member`)
        .addNumberOption(option => option.setRequired(true).setName('amount').setDescription(`Enter the amount to gift`)),

    async execute(interaction)
    {
        // Options
        const amount = interaction.options.getNumber('amount')

        // Checks
        if (!await Wallet.check(interaction)) {
            return await React.error(interaction, `No wallet`, `You have to tipping wallet yet. Please use the \`${Config.get('prefix')}deposit\` to create a new wallet`)
        }

        if (amount === 0) {
            return await React.error(interaction, `Incorrect amount`, `The tip amount should be larger than 0`)
        }

        if (amount < 0.01) {
            return await React.error(interaction, `Incorrect amount`, `The tip amount is too low`)
        }

        const wallet  = await Wallet.get(interaction, interaction.user.id)
        const balance = await Wallet.balance(wallet, Config.get(`token.default`))
        const from    = wallet.address

        if (parseFloat(amount + 0.001) > parseFloat(balance)) {
            return await React.error(interaction, `Insufficient funds`, `The amount exceeds your balance + safety margin (0.001 ${Config.get(`token.symbol`)}). Use the \`${Config.get('prefix')}deposit\` command to get your wallet address to send some more ${Config.get(`tokens.${token}.symbol`)}. Or try again with a lower amount`)
        }

        // Send embed and button
        const embed = new MessageEmbed()
            .setColor(Config.get('colors.primary'))
            .setTitle(`@${interaction.user.username} sent a gift of ${amount} ${Config.get('token.symbol')}`)
            .setDescription(`Be the first to click the button below and claim this gift!`)

        const button = new MessageActionRow()
            .addComponents(new MessageButton()
                .setCustomId('claim')
                .setLabel('Claim this gift!')
                .setStyle('SUCCESS')
                .setEmoji('🎁'),
            )

        await interaction.reply({embeds: [embed], components: [button], ephemeral: false})

        const collector = interaction.channel.createMessageComponentCollector()

        collector.on('collect', async i => {
            if (i.customId === 'claim') {
                const claimedEmbed = new MessageEmbed()
                    .setTitle(`@${interaction.user.username} sent a gift of ${amount} ${Config.get('token.symbol')}`)
                    .setDescription(`Be the first to click the button below and claim this gift!`)

                const claimedButton = new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setCustomId('claimed')
                        .setLabel(`This gift was claimed by @${i.user.username}`)
                        .setStyle('SECONDARY')
                        .setEmoji('🎁')
                        .setDisabled(true),
                    )
                await i.update({embeds: [claimedEmbed], components: [claimedButton]})

                const to   = await Wallet.recipientAddress(i, i.member.user.id, i.member)

                Transaction.addToQueue(interaction, from, to, amount, Config.get('token.default')).then(() => {
                    Transaction.runQueue(interaction, interaction.user.id, {transactionType: 'gift'}, {reply: false, react: false, ephemeral: false})
                })
            }
        })
    },
}