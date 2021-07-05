const {Command}                    = require('discord-akairo')
const {React, Wallet, Transaction} = require('../utils')

class RainCommand extends Command
{
    constructor()
    {
        super('rain', {
            aliases  : ['rain', 'mist', 'storm', 'drizzle', 'hail', 'snow', 'shower'],
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
        let amount = args.amount

        if (amount === 0) {
            await React.error(this, message, `Tip amount incorrect`, `The tip amount is wrongly formatted or missing`)
            return
        }
        if (amount < 0.01) {
            await React.error(this, message, `Tip amount incorrect`, `The tip amount is to low`)
            return
        }

        let recipients = []
        await message.channel.messages.fetch({limit: 20})
            .then(async function (lastMessages) {
                for (let [id, lastMessage] of lastMessages) {
                    let add = true

                    if (lastMessage.author.id === message.author.id) {
                        add = false
                    }

                    await Wallet.address(lastMessage.author.id).then(recipientAddress => {
                        if (recipientAddress === 0 || recipientAddress === '0' || recipientAddress === null || recipientAddress === 'null' || recipientAddress === false || recipientAddress === 'false' || recipientAddress === undefined || recipientAddress === 'undefined') {
                            add = false
                        }
                    })

                    if (lastMessage.author.bot) {
                        add = false
                    }

                    if (add && !recipients.includes(lastMessage.author.id)) {
                        recipients.push(lastMessage.author.id)
                    }
                }
            })

        if (recipients.length === 0) {
            await React.error(this, message, `Sorry`, `I couldn't find any users to rain on. Please try again when the chat is a bit more active`)
            await message.channel.send(`Wake up people! @${message.author.username} is trying to rain, but nobody is here!`)

            return
        }

        const wallet  = await Wallet.get(this, message, message.author.id)
        const balance = await Wallet.balance(wallet)

        if (parseFloat(amount + 0.001) > parseFloat(balance)) {
            await React.error(this, message, `Insufficient funds`, `The amount exceeds your balance + safety margin (0.001 ${process.env.SYMBOL}). Use the \`${process.env.MESSAGE_PREFIX}deposit\` command to get your wallet address to send some more ${process.env.SYMBOL}. Or try again with a lower amount`)
            return
        }

        const from = wallet.address
        amount     = (amount / recipients.length)

        for (let i = 0; i < recipients.length; i++) {
            const to = await Wallet.recipientAddress(this, message, recipients[i])

            await Transaction.addToQueue(this, message, from, to, amount)
        }

        await Transaction.runQueue(this, message, message.author.id, false, true)

    }
}

module.exports = RainCommand