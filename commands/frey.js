const {Command}       = require('discord-akairo')
const {Config, React} = require('../utils')
const artifact        = require('../artifacts/frey.json')
const axios           = require("axios")
const {hexToNumber}   = require("@harmony-js/utils")
const {numberToHex}   = require("@harmony-js/utils")
const {ChainType}     = require("@harmony-js/utils")
const {Harmony}       = require("@harmony-js/core")
const moment          = require('moment')

class FreyCommand extends Command
{
    constructor()
    {
        super('frey', {
            aliases  : ['frey'],
            ratelimit: 1,
            args     : [
                {
                    id     : 'number',
                    type   : 'number',
                    default: 1
                },
            ]
        })
    }

    async exec(message, args)
    {
        await React.processing(message)

        const hmy      = new Harmony(
            Config.get('token.rpc_url'),
            {
                chainType: ChainType.Harmony,
                chainId  : Config.get('chain_id'),
            },
        )
        const contract = hmy.contracts.createContract(artifact.abi, artifact.address)
        const freyInfo = await contract.methods.nfts(args.number).call()

        axios.get(`https://frey.freyala.com/meta?meta=${args.number}`).then(async response => {
            const frey      = response.data
            const block     = await hmy.blockchain.getBlockByNumber({blockNumber: numberToHex(freyInfo[2])})
            const timestamp = hexToNumber(block.result.timestamp)
            const age       = moment.duration(moment().diff(moment.unix(timestamp)), 'milliseconds')

            const embed = this.client.util.embed()
                .setColor(Config.get('colors.primary'))
                // .attachFiles('images/logo.png')
                // .setThumbnail('attachment://logo.png')
                .setTitle(frey.name)
                .setDescription(frey.description)
                .addField(`Owner`, `${freyInfo[4].substr(0, 6)}...${freyInfo[4].substr(-6, 6)}`)
            if (freyInfo[0] !== '') {
                embed.addField(`Name`, freyInfo[0])
            }

            embed
                .addField(`Age`, `${age.years()}y ${age.months()}m ${age.days()}d ${age.hours()}h`)
                .setImage(frey.image)

            await message.channel.send(embed)
            await React.done(message)
        })

    }
}

module.exports = FreyCommand