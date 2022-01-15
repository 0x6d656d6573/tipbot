const {Command} = require('discord-akairo')
const {Config}  = require('../utils')

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
        let tokensSummary = ''
        let i             = 1
        for (const [key, token] of Object.entries(Config.get('tokens'))) {
            if (i++ === Object.entries(Config.get('tokens')).length) {
                tokensSummary += ` or ${token.symbol}`
            } else {
                tokensSummary += ` ${token.symbol},`
            }
        }

        const commands   = this.client.util.embed()
            .setColor(Config.get('colors.primary'))
            .addFields([
                {name: `${Config.get('prefix')}deposit`, value: `Shows your wallet address. If you have no wallet yet a new one will be created for you`},
                {name: `${Config.get('prefix')}balance`, value: `Shows your wallet\'s balance`},
                {name: `${Config.get('prefix')}getgas`, value: `The bot will send you some gas. This command only works if your gas balance is below 0.01 \nAlias: ${Config.get('prefix')}gasmeup`},
                {name: `${Config.get('prefix')}price`, value: `Display the current ${Config.get('token.symbol')} statistics\nAlias: ${Config.get('prefix')}stats ${Config.get('prefix')}statistics`},

                // .addField(`Send Commands`, '\u200b')
                {name: `${Config.get('prefix')}send 100 0x89y92...38jhu283h9`, value: `Send ${tokensSummary} to an external address`},
                {name: `${Config.get('prefix')}sendmax 0x89y92...38jhu283h9`, value: `Send all of your ${tokensSummary} to an external address`},

                // .addField(`Tip Commands`, '\u200b')
                {name: `${Config.get('prefix')}tip 100 @user1`, value: `Send a tip to mentioned user\nAlias: ${Config.get('prefix')}gift ${Config.get('prefix')}give`},
                {name: `${Config.get('prefix')}tipsplit 100 @user1 @user2`, value: `Split a tip among mentioned users\nAlias: ${Config.get('prefix')}split ${Config.get('prefix')}splitgift ${Config.get('prefix')}divide ${Config.get('prefix')}tipdivide ${Config.get('prefix')}dividetip`},
                {name: `${Config.get('prefix')}tiprandom 100`, value: `Tip a random user from the last 20 messages\nAlias: ${Config.get('prefix')}giftrandom`},
                {name: `${Config.get('prefix')}rain 100`, value: `Distribute a tip amongst the users of the last 20 messages`},
                {name: `${Config.get('prefix')}tipstats`, value: `Display the tipping stats top 10\nAlias: ${Config.get('prefix')}tipstatistics`},
                {name: `${Config.get('prefix')}legends`, value: `Display the legendary bèta tipping top 10`},

                // .addField(`Burn Commands`, '\u200b')
                {name: `${Config.get('prefix')}burn 100`, value: `Burn tokens`},
                {name: `${Config.get('prefix')}burnstats`, value: `Display the burning stats top 10\nAlias: ${Config.get('prefix')}burnstatistics`},

                // .addField(`Staking Commands`, '\u200b')
                {name: `${Config.get('prefix')}stake 100`, value: `Stake the given amount of ${Config.get('token.symbol')}. If no amount is provided the total ${Config.get('token.symbol')} balance will be staked`},
                {name: `${Config.get('prefix')}unstake 100`, value: `Unstake the given amount of ${Config.get('token.symbol')}. If no amount is provided the total ${Config.get('token.symbol')} balance will be unstaked`},
                {name: `${Config.get('prefix')}claim`, value: `Claim your earned rewards. Your total reward balance will be sent to your wallet`},
                {name: `${Config.get('prefix')}stakebalance`, value: `Shows your staked ${Config.get('token.symbol')} and reward balance \nAlias: ${Config.get('prefix')}staked`},

                // .addField(`Trivia Commands`, '\u200b')
                {name: `${Config.get('prefix')}trivia`, value: `This command will start a quiz question in #📚trivia-games. I will ask you for some information that I need to set it up. When we're done I will place the question and start a countdown. When it ends I will reward all of the winning answers`},

                // .addField(`NFT Commands`, '\u200b')
                {name: `${Config.get('prefix')}frey 123`, value: `This command is a way to show off your Frey. It will show an image and all the statistics of your Frey`},
                {name: `${Config.get('prefix')}plot xya 123`, value: `Also bought some plots? show them off using this command. In the first (and optional) parameter you can tell reginald to look in either XYA, YIN, or in YANG. The parameters default to "xya" and "1"`},
                {name: `${Config.get('prefix')}pig 123`, value: `Coink! Coink! Show of your bacon to your friends using this command!`},

                // .addField(`Miscellaneous Commands`, '\u200b')
                {name: `${Config.get('prefix')}optin`, value: `A way to opt-in to the Degen or Trivia role\nAlias: ${Config.get('prefix')}opt-in ${Config.get('prefix')}countmein`},
                {name: `${Config.get('prefix')}optout`, value: `A way to opt-out of the Degen or Trivia role\nAlias: ${Config.get('prefix')}opt-out ${Config.get('prefix')}imout`},
                {name: `${Config.get('prefix')}version`, value: `Show the current tipbot version\nAlias: ${Config.get('prefix')}v`},
                {name: `${Config.get('prefix')}ping`, value: `Responds with "pong!" when the bot is online`},
                {name: `${Config.get('prefix')}degen`, value: `Fake command the bot will react to with a ✅ \n These commands are only available in #🤪degen-chat\nAlias: ${Config.get('prefix')}slarp ${Config.get('prefix')}slurp ${Config.get('prefix')}dip ${Config.get('prefix')}rug ${Config.get('prefix')}rugpull ${Config.get('prefix')}burnall`},
            ])

        const multiToken = this.client.util.embed()
            .setColor(Config.get('colors.primary'))
            .setTitle(`Multi token`)
            .setDescription(`You can use either ${tokensSummary} for tipping. To tip with a different token use this format: \`${Config.get('prefix')}[command] [amount] [token] [optional: address]\`. If no token is defined, the bot will use it's default token (${Config.get('token.symbol')})`)

        const info = this.client.util.embed()
            .setColor(Config.get('colors.info'))
            .setTitle(`:information_source: Cooldown`)
            .setDescription(`In order to prevent spamming there is a cooldown period of ${parseFloat(Config.get('cooldown')) / 1000} seconds per command per user.`)

        await message.author.send(commands)
        await message.author.send(multiToken)
        await message.author.send(info)
    }
}

module.exports = HelpCommand