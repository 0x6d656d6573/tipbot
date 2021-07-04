const {Command}                    = require('discord-akairo')
const {React, Wallet, Transaction} = require('../utils')

class TipCommand extends Command
{
    constructor()
    {
        super('tip', {
            aliases  : ['tip', 'gift', 'give'],
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
        const amount    = args.amount
        const recipient = message.mentions.users.first()

        if (amount === 0) {
            await React.error(this, message, `Tip amount incorrect`, `The tip amount is wrongly formatted or missing`)
            return
        }
        if (amount < 0.01) {
            await React.error(this, message, `Tip amount incorrect`, `The tip amount is to low`)
            return
        }
        if (!message.mentions.users.size) {
            await React.error(this, message, `Missing user`, `Please mention a valid user`)
            return
        }
        if (recipient.bot) {
            await React.error(this, message, `Invalid user`, `You are not allowed to tip bots`)
            return
        }
        if (recipient.id === message.author.id) {
            await React.error(this, message, `Invalid user`, `You are not allowed to tip yourself`)
            return
        }

        const wallet  = await Wallet.get(this, message, message.author.id)
        const balance = await Wallet.balance(wallet)

        if (parseFloat(amount + 0.001) > parseFloat(balance)) {
            await React.error(this, message, `Insufficient funds`, `The amount exceeds your balance + safety margin (0.001 ${process.env.SYMBOL}). Use the \`${process.env.MESSAGE_PREFIX}deposit\` command to get your wallet address to send some more ${process.env.SYMBOL}. Or try again with a lower amount`)
            return
        }

        const from = wallet.address
        const to   = await Wallet.recipientAddress(this, message, recipient.id)

        if (from === to) {
            await React.error(this, message, `Invalid user`, `That's you, you moron!`)
            return
        }

        Transaction.addToQueue(this, message, from, to, amount).then(() => {
            Transaction.runQueue(this, message, message.author.id)
        })
    }
}

module.exports = TipCommand