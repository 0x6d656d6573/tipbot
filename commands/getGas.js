const {SlashCommandBuilder}                = require('@discordjs/builders')
const {Wallet, React, Config, Transaction} = require("../utils")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`get-gas`)
        .setDescription(`Reginald will send you some gas. This only works if your gas balance is below 0.01`),

    async execute(interaction)
    {
        // Defer reply
        await interaction.deferReply({ephemeral: true});

        // Checks
        if (!await Wallet.check(interaction)) {
            return await React.error(interaction, `No wallet`, `You have to tipping wallet yet. Please use the \`${Config.get('prefix')}deposit\` to create a new wallet`, true)
        }

        // Gather data
        const wallet  = await Wallet.get(interaction, interaction.user.id)
        const balance = await Wallet.gasBalance(wallet)

        // Check for exploits
        if (parseFloat(balance) >= 0.1) {
            return await React.error(interaction, `Are you trying to scam me?`, `You have ${balance} ONE!`, true)
        }

        // Send gas
        await Transaction.sendGas(interaction, process.env.BOT_WALLET_ADDRESS, wallet.address, 0.1, process.env.BOT_WALLET_PRIVATE_KEY)

        await React.success(interaction, `Success!`, 'Some gas was sent to your wallet', true)

        await React.message(interaction, 'get_gas')
    },
}