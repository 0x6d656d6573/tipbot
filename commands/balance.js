const {Command}               = require('discord-akairo')
const {Config, React, Wallet} = require('../utils')

class BalanceCommand extends Command
{
    constructor()
    {
        super('balance', {
            aliases  : ['balance'],
            channel  : 'dm',
            ratelimit: 1,
        })
    }

    async exec(message)
    {
        await React.processing(message)
        if (!await Wallet.check(this, message, message.author.id)) {
            return
        }
        const wallet     = await Wallet.get(this, message, message.author.id)
        const gasBalance = await Wallet.gasBalance(wallet)

        await React.done(message)

        const embed = this.client.util.embed()
            .setColor(Config.get('colors.primary'))
            .setTitle(`Your balance`)

        for (const key in Config.get('tokens')) {
            const balance = await Wallet.balance(wallet, key)
            embed.addField(`${Config.get(`tokens.${key}.symbol`)}`, '```' + balance + ' ' + Config.get(`tokens.${key}.symbol`) + '```')
        }

        embed.addField(`ONE`, '```' + gasBalance + ' ONE```')

        await message.author.send(embed)
    }
}

module.exports = BalanceCommand