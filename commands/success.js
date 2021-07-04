const {Command} = require('discord-akairo')
const {React}   = require('../utils')

class SuccessCommand extends Command
{
    constructor()
    {
        super('success', {
            aliases: ['success', 'burnall', 'slarp', 'payout', 'payday'],
        })
    }

    async exec(message)
    {
        await React.success(this, message)
    }
}

module.exports = SuccessCommand