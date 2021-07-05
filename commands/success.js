const {Command} = require('discord-akairo')
const {React}   = require('../utils')

class SuccessCommand extends Command
{
    constructor()
    {
        super('success', {
            aliases: [
                'success',
                'burnall',
                'slurp',
                'slarp',
                'dip',
                'payout',
                'payday',
                'rug'
            ],
        })
    }

    async exec(message)
    {
        await React.success(this, message)
    }
}

module.exports = SuccessCommand