const {Command}       = require('discord-akairo')
const {Config, React} = require('../utils')
const artifact        = require('../artifacts/plot.json')
const axios           = require("axios")
const {hexToNumber}   = require("@harmony-js/utils")
const {numberToHex}   = require("@harmony-js/utils")
const {ChainType}     = require("@harmony-js/utils")
const {Harmony}       = require("@harmony-js/core")
const moment          = require('moment')
const Discord         = require("discord.js")

class PlotCommand extends Command
{
    constructor()
    {
        super('plot', {
            aliases  : ['plot'],
            ratelimit: 1,
            args     : [
                {
                    id     : 'token',
                    type   : ['xya', 'yin', 'yang'],
                    default: 'xya'
                },
                {
                    id     : 'id',
                    type   : 'number',
                    default: 1
                },
            ]
        })
    }

    async exec(message, args)
    {
        await React.processing(message)

        const addresses = {
            'xya' : '0x66173da60415857fc1d50fb1d502060ad09d1bf2',
            'yin' : '0x40ad4aef3a74c57d0c4829de97184d909bebc09f',
            'yang': '0xfe1ef7984f0051e00eac463e7f57ebf2fc2798b0',
        }

        const soilTypes = [
            'Clay',
            'Loam',
            'Sand',
            'Silt'
        ]

        const neighbourhoods = [
            'Mercafell',
            'Ardenia Fields',
            'Ardenia Valleys',
            'Sora Plains',
            'Lightside Estate',
            'Litha Sanctuary',
            'Jara Isles',
            'Whitepines Quarry',
            'Irae Haven',
            'Machir City',
            'Zaro Plains',
            'Cyran City',
            'Carroway District',
            'Arixa Estate',
            'Josiro Retreat',
            'Frey Oasis',
            'Xera Settlement (YANG)',
            'Sora Gardens (YANG)',
            'Halis Ruins (YIN)',
            'Yira Citadel (YIN)'
        ]

        const hmy      = new Harmony(
            Config.get('token.rpc_url'),
            {
                chainType: ChainType.Harmony,
                chainId  : Config.get('chain_id'),
            },
        )
        const contract = hmy.contracts.createContract(artifact.abi, addresses[args.token])
        const plot     = await contract.methods.plots(args.id).call()

        const embed = this.client.util.embed()
            .setColor(Config.get('colors.primary'))
            .setTitle(`Plot #${plot[4]}`)
            .attachFiles('images/logo.png')
            .setThumbnail("attachment://logo.png")
            .setImage('https://world.freyala.com/images/map/worldmap.png')
            .addFields(
                {name: `Neighbourhood`, value: neighbourhoods[plot[5]], inline: true},
                {name: `Chest`, value: `${(plot[3] / Math.pow(10, Config.get(`token.decimals`))).toFixed(2)} XYA`, inline: true},
                {name: `Soil type`, value: soilTypes[plot[6]], inline: true},
                {name: `Fertility`, value: plot[7], inline: true},
                {name: `Level`, value: plot[8], inline: true},
                {name: `Crime rate`, value: plot[9], inline: true},
            )
            .addField('\u200b', '\u200b')
            .addField(`Owner`, `${plot[1].substr(0, 6)}...${plot[1].substr(-6, 6)}`)

        await message.channel.send(embed)
        await React.done(message)
    }
}

module.exports = PlotCommand