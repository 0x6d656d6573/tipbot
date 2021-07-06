const {Command} = require('discord-akairo')

class HelpCommand extends Command
{
    constructor()
    {
        super('help', {
            aliases: ['help'],
        })
    }

    async exec(message)
    {
        const warning = this.client.util.embed()
            .setColor('#e7c000')
            .setTitle(`:warning: Warning`)
            .setDescription(`This Bot is still in beta. The bot can crash on simple queries, please use and test this version with caution.`)

        await message.author.send(warning)

        const commands = this.client.util.embed()
            .setColor('#1DB151')
            .setTitle(`${process.env.SYMBOL} Tip Bot Commands`)
            .addField(`!fdeposit`, `Shows your wallet address. If you have no wallet yet a new one will be created for you`)// todo
            .addField(`!fbalance`, `Shows your wallet's balance`)
            .addField(`!fgetgas`, `The bot will send you some gas. This command only works if your gas balance is below 0.01`)
            .addField(`!fsend 100 0x89y92...38jhu283h9`, `Send XYA to an external address`)
            .addField(`!fsendmax 0x89y92...38jhu283h9`, `Send all of your XYA to an external address`)
            .addField(`!ftip 100 @user1`, `Send a tip to mentioned user`)
            .addField(`!ftipsplit 100 @user1 @user2`, `Split a tip among mentioned users`)
            .addField(`!ftiprandom 100`, `Tip a random user from the last 20 messages`)
            .addField(`!frain 100`, `Distribute a tip amongst the users of the last 20 messages`)
            .addField(`!ftipstats`, `Display the tipping stats top 10`)
            .addField(`!fburn 100`, `Burn tokens`)
            .addField(`!fburnstats`, `Display the burning stats top 10`)
            .addField(`!fclearqueue`, `Clear your transaction queue`)

        await message.author.send(commands)
    }
}

module.exports = HelpCommand