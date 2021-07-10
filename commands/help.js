const {Command} = require('discord-akairo')

class HelpCommand extends Command
{
    constructor()
    {
        super('help', {
            aliases  : ['help'],
            ratelimit: 1,
        })
    }

    async exec(message)
    {
        const commands = this.client.util.embed()
            .setColor('#7fca49')
            .setTitle(`${process.env.SYMBOL} Tip Bot Commands`)
            .addField('`!fdeposit`', 'Shows your wallet address. If you have no wallet yet a new one will be created for you')
            .addField('`!fbalance`', 'Shows your wallet\'s balance')
            .addField('`!fgetgas`', 'The bot will send you some gas. This command only works if your gas balance is below 0.01 \nAlias: `!fgasmeup`')
            .addField('`!fsend 100 0x89y92...38jhu283h9`', 'Send XYA to an external address')
            .addField('`!fsendmax 0x89y92...38jhu283h9`', 'Send all of your XYA to an external address')
            .addField('`!ftip 100 @user1`', 'Send a tip to mentioned user\nAlias: `!fgift` `!fgive`')
            .addField('`!ftipsplit 100 @user1 @user2`', 'Split a tip among mentioned users\nAlias: `!fsplit` `!fsplitgift` `!fdivide` `!ftipdivide` `!fdividetip`')
            .addField('`!ftiprandom 100`', 'Tip a random user from the last 20 messages\nAlias: `!fgiftrandom`')
            .addField('`!frain 100`', 'Distribute a tip amongst the users of the last 20 messages')
            .addField('`!ftipstats`', 'Display the tipping stats top 10\nAlias: `!ftipstatistics`')
            .addField('`!legends`', 'Display the legendary bèta tipping top 10')
            .addField('`!fburn 100`', 'Burn tokens')
            .addField('`!fburnstats`', 'Display the burning stats top 10\nAlias: `!fburnstatistics`')
            .addField('`!fprice`', 'Display the current XYA statistics\nAlias: `!fstats` `!fstatistics`')
            .addField('`!fversion`', 'Show the current tipbot version\nAlias: `!fv`')
            .addField('`!fping`', 'Responds with "pong!" when the bot is online')
            .addField('`!fdegen`', 'Fake command the bot will react to with a ✅ \n These commands are only available in #🤪degen-chat\nAlias: `!fslarp` `!fslurp` `!fdip` `!frug` `!frugpull` `!fburnall`')
        await message.author.send(commands)

        const info = this.client.util.embed()
            .setColor('#0EA5E9')
            .setTitle(`:information_source: Cooldown`)
            .setDescription(`In order to prevent spamming there is a cooldown period of 20 seconds per command per user.`)
        await message.author.send(info)
    }
}

module.exports = HelpCommand