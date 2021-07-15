const {Command}                            = require('discord-akairo')
const {Config, React, Wallet, Transaction} = require('../utils')

class TipsplitCommand extends Command
{
    constructor()
    {
        super('tipsplit', {
            aliases  : ['tipsplit', 'split', 'splitgift', 'divide', 'tipdivide', 'dividetip'],
            channel  : 'guild',
            ratelimit: 1,
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
        let amount       = args.amount
        const recipients = message.mentions.users

        if (amount === 0) {
            await React.error(this, message, `Tip amount incorrect`, `The tip amount is wrongly formatted or missing`)
            return
        }
        if (amount < 0.01) {
            await React.error(this, message, `Tip amount incorrect`, `The tip amount is too low`)
            return
        }
        if (!message.mentions.users.size) {
            await React.error(this, message, `Missing user`, `Please mention a valid user`)
            return
        }

        const wallet  = await Wallet.get(this, message, message.author.id)
        const balance = await Wallet.balance(wallet)

        if (parseFloat(amount + 0.001) > parseFloat(balance)) {
            await React.error(this, message, `Insufficient funds`, `The amount exceeds your balance + safety margin (0.001 ${Config.get('token.symbol')}). Use the \`${Config.get('prefix')}deposit\` command to get your wallet address to send some more ${Config.get('token.symbol')}. Or try again with a lower amount`)
            return
        }

        const from = wallet.address

        let recipientsFiltered = []
        for (let [id, recipient] of recipients) {
            const recipientAddress = await Wallet.recipientAddress(this, message, id)

            if (!recipientAddress) {
                const embed = this.client.util.embed()
                    .setColor(Config.get('colors.error'))
                    .setTitle(`@${message.author.username} tried to tip you some ${Config.get('token.symbol')}`)
                    .setDescription(`unfortunately you do not have a ${Config.get('token.symbol')} bot wallet yet. If you want to be able to receive tips, you can create a wallet by using the \`${Config.get('prefix')}deposit\` command.`)

                await message.author.send(embed)
            }

            let match = true
            if (recipientAddress === from) {
                match = false
            }
            if (recipient.bot) {
                match = false
            }
            recipientsFiltered.push(recipientAddress)
        }

        amount = (amount / recipientsFiltered.length)

        for (let i = 0; i < recipientsFiltered.length; i++) {
            await Transaction.addToQueue(this, message, from, recipientsFiltered[i], amount)
        }

        await Transaction.runQueue(this, message, message.author.id, false, true)
    }
}

module.exports = TipsplitCommand