const {SlashCommandBuilder}                = require('@discordjs/builders')
const {Config, React, Wallet, Transaction} = require('../utils')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tip')
        .setDescription(`Send a tip to the mentioned user`)
        .addNumberOption(option => option.setRequired(true).setName('amount').setDescription(`Enter the amount to tip`))
        .addMentionableOption(option => option.setRequired(true).setName('recipient').setDescription(`Select the recipient`))
        .addStringOption(option => option.setRequired(false).setName('token').setDescription(`Change the token`).addChoices([
            ["COINKx", "coinkx"]
        ])),

    async execute(interaction)
    {
        // Defer reply
        await interaction.deferReply({ephemeral: false})

        // Options
        const amount    = interaction.options.getNumber('amount')
        const recipient = interaction.options.getMentionable('recipient')
        const token     = interaction.options.getString('token') ?? 'xya'

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

        if (recipient.user.id === process.env.BOT_ID) {
            return await React.error(interaction, `Invalid user`, `I am flattered but I cannot take this from you`)
        }

        if (recipient.user.bot) {
            return await React.error(interaction, `Invalid user`, `You are not allowed to tip bots`)
        }

        if (recipient.user.id === interaction.user.id) {
            return await React.error(interaction, `Invalid user`, `That's you, you moron!`)
        }

        const wallet  = await Wallet.get(interaction, interaction.user.id)
        const balance = await Wallet.balance(wallet, token)

        if (parseFloat(amount + 0.001) > parseFloat(balance)) {
            return await React.error(interaction, `Insufficient funds`, `The amount exceeds your balance + safety margin (0.001 ${Config.get(`tokens.${token}.symbol`)}). Use the \`${Config.get('prefix')}deposit\` command to get your wallet address to send some more ${Config.get(`tokens.${token}.symbol`)}. Or try again with a lower amount`)
        }

        const from = wallet.address
        const to   = await Wallet.recipientAddress(interaction, recipient.user.id, recipient)

        Transaction.addToQueue(interaction, from, to, amount, token, recipient.user.id).then(() => {
            Transaction.runQueue(interaction, interaction.user.id, {transactionType: 'tip'}, {reply: true, react: true, ephemeral: false})
        })

        await React.message(interaction, 'tip', amount)
    },
}