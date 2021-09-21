const {Command}                = require('discord-akairo')
const {Config, Helpers, React} = require('../utils')

class RockPaperScissorsCommand extends Command
{
    constructor()
    {
        super('rock', {
            aliases  : ['rock', 'paper', 'scissors', 'rockpaperscissors', 'rpc'],
            ratelimit: 1,
            args     : [
                {
                    id     : 'amount',
                    type   : 'number',
                    default: 0
                },
                {
                    id       : 'member',
                    type     : 'member',
                    unordered: true
                }
            ]
        })
    }

    async exec(message, args)
    {
        const alias   = await Helpers.getAlias(message)

        const options = [
            {'name': 'rock', 'defeats': 'scissors', 'emoji': '🪨'},
            {'name': 'paper', 'defeats': 'rock', 'emoji': '📜'},
            {'name': 'scissors', 'defeats': 'paper', 'emoji': '✂️'},
        ]

        if (alias !== 'rockpaperscissors' && alias !== 'rps') {
            const playerChoice = options.find(option => option.name === message.content.replace(Config.get('prefix'), ''))
            const botChoice    = options[Object.keys(options)[Math.floor(Math.random() * Object.keys(options).length)]]
            const titleArray   = await Config.get(`response.titles`)
            const randomTitle  = titleArray[Math.floor(Math.random() * titleArray.length)]

            let outcome
            if (playerChoice.name === botChoice.name) {
                outcome = `Unfortunately there is no winner this time`
            }
            if (playerChoice.name === botChoice.defeats) {
                outcome = `Sorry you lost ${randomTitle}`
            }
            if (playerChoice.defeats === botChoice.name) {
                outcome = `You won ${randomTitle}!`
            }

            await message.react(botChoice.emoji)
            await message.reply(outcome)
        } else {
            let authorShape, opponentShape
            const filter = () => {
                return true
            }

            // const authorEmbed = this.client.util.embed()
            //     .setColor(Config.get('colors.primary'))
            //     .setTitle(`Please select your shape`)
            // const authorQuestion = await message.author.send(authorEmbed)
            // await authorQuestion.react('🪨')
            // await authorQuestion.react('📜')
            // await authorQuestion.react('✂️')
            // await authorQuestion.awaitReactions(filter, {max: 1, time: 15000, errors: ['time']})
            //     .then(collected => {
            //         authorShape = options.find(option => option.emoji === collected.first().emoji.name)
            //         console.log(authorShape); // REMOVE
            //     })
            //     .catch(() => {
            //         message.author.send(`Your reaction took too long. I canceled the game`)
            //     })

            const opponentEmbed    = this.client.util.embed()
                .setColor(Config.get('colors.primary'))
                .setTitle(`Please select your shape`)
            const opponentQuestion = await args.member.user.send(opponentEmbed)
            await opponentQuestion.react('🪨')
            await opponentQuestion.react('📜')
            await opponentQuestion.react('✂️')
            await opponentQuestion.awaitReactions(filter, {max: 1, time: 15000, errors: ['time']})
                .then(collected => {
                    opponentShape = options.find(option => option.emoji === collected.first().emoji.name)
                    console.log(opponentShape) // REMOVE
                })
                .catch(() => {
                    args.member.user.send(`Your reaction took too long. I canceled the game`)
                })

            console.log(authorShape, opponentShape) // REMOVE
            if (authorShape && opponentShape) {
                let outcome
                if (authorShape.name === opponentShape.name) {
                    outcome = `It's a draw`
                }
                if (authorShape.defeats === opponentShape.name) {
                    outcome = `${message.author.username} won this round!`
                }
                if (opponentShape.defeats === authorShape.name) {
                    outcome = `${args.member.user.username} won this round!`
                }

                const outcomeEmbed = this.client.util.embed()
                    .setColor(Config.get('colors.primary'))
                    .setTitle(outcome)
                await args.member.user.send(outcomeEmbed)
            }
        }
    }
}

module.exports = RockPaperScissorsCommand