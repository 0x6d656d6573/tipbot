const {Command}                    = require('discord-akairo')
const {React, Wallet, Transaction} = require('../utils')

class BurnCommand extends Command
{
    constructor()
    {
        super('burn', {
            aliases  : ['burn', 'destroy', 'kill', 'remove', 'delete'],
            channel  : 'guild',
            ratelimit: 2,
            args     : [
                {
                    id     : 'amount',
                    type   : 'number',
                    default: 0
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

        const amount = args.amount

        if (amount === 0) {
            await React.error(this, message, `Burn amount incorrect`, `The burn amount is wrongly formatted or missing`)
            return
        }
        if (amount < 0.01) {
            await React.error(this, message, `Burn amount incorrect`, `The burn amount is to low`)
            return
        }

        const wallet  = await Wallet.get(this, message, message.author.id)
        const balance = await Wallet.balance(wallet)
        const from    = wallet.address
        const to      = '0x000000000000000000000000000000000000dead'

        if (parseFloat(amount + 0.001) > parseFloat(balance)) {
            await React.error(this, message, `Insufficient funds`, `The amount exceeds your balance + safety margin (0.001 ${process.env.SYMBOL}). Use the \`${process.env.MESSAGE_PREFIX}deposit\` command to get your wallet address to send some more ${process.env.SYMBOL}. Or try again with a lower amount`)
            return
        }

        Transaction.addToQueue(this, message, from, to, amount).then(() => {
            Transaction.runQueue(this, message, message.author.id, false, false, null, true)
        })
    }
}

module.exports = BurnCommand