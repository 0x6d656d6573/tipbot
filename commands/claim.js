const {SlashCommandBuilder}            = require('@discordjs/builders')
const {React, Wallet, Staking, Config} = require('../utils')
const {address}                        = require("../utils/Wallet")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('claim')
        .setDescription(`Claim your earned rewards. Your total reward balance will be sent to your wallet`),

    async execute(interaction)
    {
        // Defer reply
        await interaction.deferReply({ephemeral: true});

        // Get data
        const wallet        = await Wallet.get(interaction, interaction.user.id)
        const rewardBalance = await Staking.rewardBalance(wallet.address)

        // Checks
        if (parseInt(rewardBalance) === 0) {
            return await React.error(interaction, `You have not earned any rewards yet`, `Rewards are handed out every 24h after you first register. Please be patient`, true)
        }

        // Make transaction
        try {
            await Staking.claimRewards(interaction, wallet)

            return await React.success(interaction, `${rewardBalance} ${Config.get('token.symbol')} was claimed successfully`, null, true)
        } catch (error) {
            return await React.error(interaction, `An error has occurred`, `Please contact ${Config.get('error_reporting_users')}`, true)
        }
    },
}