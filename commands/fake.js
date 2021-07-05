const {Command} = require('discord-akairo')
const {React}   = require('../utils')

class SuccessCommand extends Command
{
    constructor()
    {
        super('fake', {
            aliases: [
                'fake',
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