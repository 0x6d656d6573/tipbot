const {Command}                    = require('discord-akairo')
const {React, Wallet, Transaction} = require('../utils')

class SendMaxCommand extends Command
{
    constructor()
    {
        super('sendmax', {
            aliases: ['sendmax'],
            channel: 'dm',
            args   : [
                {
                    id     : 'to',
                    type   : 'string',
                    default: false
                }
            ]
        })
    }

    async exec(message, args)
    {
        await React.processing(message)

        if (!await Wallet.check(this, message, message.author.id)) {
            return
        }

        const wallet  = await Wallet.get(this, message, message.author.id)
        const balance = await Wallet.balance(wallet)
        const from    = wallet.address
        const to      = args.to
        const amount  = parseFloat(balance) - 0.001

        Transaction.addToQueue(this, message, from, to, amount).then(() => {
            Transaction.runQueue(this, message, message.author.id, true, false, true, false)
        })
    }
}

module.exports = SendMaxCommand