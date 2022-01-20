const {SlashCommandBuilder}                = require('@discordjs/builders')
const {Config, React, Wallet, Transaction} = require('../utils')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('burn')
        .setDescription(`Burn tokens`)
        .addNumberOption(option => option.setRequired(true).setName('amount').setDescription(`Enter the amount to burn`)),

    async execute(interaction)
    {
        // Defer reply
        await interaction.deferReply({ephemeral: false});

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
        const to      = '0x000000000000000000000000000000000000dead'

        if (parseFloat(amount + 0.001) > parseFloat(balance)) {
            return await React.error(interaction, `Insufficient funds`, `The amount exceeds your balance + safety margin (0.001 ${Config.get(`token.symbol`)}). Use the \`${Config.get('prefix')}deposit\` command to get your wallet address to send some more ${Config.get(`token.symbol`)}. Or try again with a lower amount`)
        }

        Transaction.addToQueue(interaction, from, to, amount, Config.get(`token.default`)).then(() => {
            Transaction.runQueue(interaction, interaction.user.id, {transactionType: 'burn'}, {reply: true, react: true, ephemeral: false})
        })

        await React.message(interaction, 'burn')
    },
}