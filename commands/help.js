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
            .addField(`${process.env.MESSAGE_PREFIX}deposit`, `Shows your wallet address. If you have no wallet yet a new one will be created for you`)
            .addField(`${process.env.MESSAGE_PREFIX}balance`, `Shows your wallet\'s balance`)
            .addField(`${process.env.MESSAGE_PREFIX}getgas`, `The bot will send you some gas. This command only works if your gas balance is below 0.01 \nAlias: ${process.env.MESSAGE_PREFIX}gasmeup`)
            .addField(`${process.env.MESSAGE_PREFIX}send 100 0x89y92...38jhu283h9`, `Send XYA to an external address`)
            .addField(`${process.env.MESSAGE_PREFIX}sendmax 0x89y92...38jhu283h9`, `Send all of your XYA to an external address`)
            .addField(`${process.env.MESSAGE_PREFIX}tip 100 @user1`, `Send a tip to mentioned user\nAlias: ${process.env.MESSAGE_PREFIX}gift ${process.env.MESSAGE_PREFIX}give`)
            .addField(`${process.env.MESSAGE_PREFIX}tipsplit 100 @user1 @user2`, `Split a tip among mentioned users\nAlias: ${process.env.MESSAGE_PREFIX}split ${process.env.MESSAGE_PREFIX}splitgift ${process.env.MESSAGE_PREFIX}divide ${process.env.MESSAGE_PREFIX}tipdivide ${process.env.MESSAGE_PREFIX}dividetip`)
            .addField(`${process.env.MESSAGE_PREFIX}tiprandom 100`, `Tip a random user from the last 20 messages\nAlias: ${process.env.MESSAGE_PREFIX}giftrandom`)
            .addField(`${process.env.MESSAGE_PREFIX}rain 100`, `Distribute a tip amongst the users of the last 20 messages`)
            .addField(`${process.env.MESSAGE_PREFIX}tipstats`, `Display the tipping stats top 10\nAlias: ${process.env.MESSAGE_PREFIX}tipstatistics`)
            .addField(`${process.env.MESSAGE_PREFIX}legends`, `Display the legendary bèta tipping top 10`)
            .addField(`${process.env.MESSAGE_PREFIX}burn 100`, `Burn tokens`)
            .addField(`${process.env.MESSAGE_PREFIX}burnstats`, `Display the burning stats top 10\nAlias: ${process.env.MESSAGE_PREFIX}burnstatistics`)
            .addField(`${process.env.MESSAGE_PREFIX}price`, `Display the current XYA statistics\nAlias: ${process.env.MESSAGE_PREFIX}stats ${process.env.MESSAGE_PREFIX}statistics`)
            .addField(`${process.env.MESSAGE_PREFIX}version`, `Show the current tipbot version\nAlias: ${process.env.MESSAGE_PREFIX}v`)
            .addField(`${process.env.MESSAGE_PREFIX}ping`, `Responds with "pong!" when the bot is online`)
            .addField(`${process.env.MESSAGE_PREFIX}degen`, `Fake command the bot will react to with a ✅ \n These commands are only available in #🤪degen-chat\nAlias: ${process.env.MESSAGE_PREFIX}slarp ${process.env.MESSAGE_PREFIX}slurp ${process.env.MESSAGE_PREFIX}dip ${process.env.MESSAGE_PREFIX}rug ${process.env.MESSAGE_PREFIX}rugpull ${process.env.MESSAGE_PREFIX}burnall`)
        await message.author.send(commands)

        const info = this.client.util.embed()
            .setColor('#0EA5E9')
            .setTitle(`:information_source: Cooldown`)
            .setDescription(`In order to prevent spamming there is a cooldown period of 20 seconds per command per user.`)
        await message.author.send(info)
    }
}

module.exports = HelpCommand