const {SlashCommandBuilder} = require('@discordjs/builders')
const {Config, React}       = require('../utils')
const artifact              = require('../artifacts/plot.json')
const {ChainType}           = require("@harmony-js/utils")
const {Harmony}             = require("@harmony-js/core")
const {MessageEmbed}        = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`plot`)
        .setDescription(`Also bought some plots? show them off using this command!`)
        .addStringOption(option => option.setRequired(true).setName('token').setDescription(`Select a token`).addChoices([
            ["XYA", "xya"],
            ["YIN", "yin"],
            ["YANG", "yang"]
        ]))
        .addNumberOption(option => option.setRequired(true).setName('number').setDescription(`Enter the plot number`)),

    async execute(interaction)
    {
        // Defer reply
        await interaction.deferReply({ephemeral: false});

        // Options
        const number = interaction.options.getNumber('number')
        const token  = interaction.options.getString('token')

        // Gather data
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
        const contract = hmy.contracts.createContract(artifact.abi, addresses[token])
        const plot     = await contract.methods.plots(number).call()
        const owner    = await contract.methods.ownerOf(number).call()

        if (plot[0] === '0x0000000000000000000000000000000000000000') {
            return await React.error(interaction, `Plot not found`, `The plot number is wrongly formatted or does not exist`, true)
        }

        // Send embed
        const embed = new MessageEmbed()
            .setColor(Config.get('colors.primary'))
            .setThumbnail(Config.get(`tokens.${token}.thumbnail`))
            .setTitle(`Plot #${number}`)
            .addFields(
                {name: `Neighbourhood`, value: neighbourhoods[plot[5]], inline: true},
                {name: `Chest`, value: `${(plot[3] / Math.pow(10, Config.get(`token.decimals`))).toFixed(2)} XYA`, inline: true},
                {name: `Soil type`, value: soilTypes[plot[6]], inline: true},
                {name: `Fertility`, value: plot[7], inline: true},
                {name: `Level`, value: plot[8], inline: true},
                {name: `Crime rate`, value: plot[9], inline: true},
            )
            .addField(`Owner`, `${owner.substr(0, 6)}...${owner.substr(-6, 6)}`)

        await interaction.editReply({embeds: [embed], ephemeral: false})
    },
}