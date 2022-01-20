const {SlashCommandBuilder}            = require('@discordjs/builders')
const {React, Wallet, Staking, Config} = require('../utils')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unstake')
        .setDescription(`Unstake the given amount of ${Config.get('token.symbol')}. If no amount is provided the total ${Config.get('token.symbol')} balance will be unstaked`)
        .addNumberOption(option => option.setRequired(false).setName('amount').setDescription(`Enter the amount to stake`)),

    async execute(interaction)
    {
        // Defer reply
        await interaction.deferReply({ephemeral: true})

        // Options
        let amount = interaction.options.getNumber('amount')

        // Get data
        const wallet = await Wallet.get(interaction, interaction.user.id)

        // Checks
        if (!amount) {
            const balance = await Wallet.balance(wallet, 'xya')
            amount        = parseFloat(balance) - 0.001
        }

        // Make transaction
        try {
            if (!await Staking.status(wallet.address)) {
                return await React.error(interaction, `You have no staked tokens yet`, `Use the ${Config.get(`prefix`)}help command to se how to stake your ${Config.get(`token.symbol`)}`, true)
            }

            await Staking.unstake(interaction, wallet, amount)

            return await React.success(interaction, `${amount} ${Config.get('token.symbol')} was unstaked successfully`, null, true)
        } catch (error) {
            return await React.error(interaction, `An error has occurred`, `Please contact ${Config.get('error_reporting_users')}`, true)
        }
    },
}