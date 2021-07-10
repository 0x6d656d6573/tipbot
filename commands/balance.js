const {Command} = require('discord-akairo')
const {React, Wallet}  = require('../utils')

class BalanceCommand extends Command
{
    constructor()
    {
        super('balance', {
            aliases: ['balance'],
            channel  : 'dm',
            ratelimit: 1,
        })
    }

    async exec(message)
    {
        await React.processing(message);
        if (!await Wallet.check(this, message, message.author.id)) {
            return
        }
        const wallet     = await Wallet.get(this, message, message.author.id)
        const balance    = await Wallet.balance(wallet)
        const gasBalance = await Wallet.gasBalance(wallet)

        await React.done(message)

        const embed = this.client.util.embed()
            .setColor('#7fca49')
            .setTitle(`Your balance`)
            .addField(`${process.env.SYMBOL}`, '```' + balance + ' ' + process.env.SYMBOL + '```')
            .addField(`ONE`, '```' + gasBalance + ' ONE```')
        await message.author.send(embed)
    }
}

module.exports = BalanceCommand