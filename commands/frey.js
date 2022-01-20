const {SlashCommandBuilder, time} = require('@discordjs/builders')
const {ethers}                    = require('ethers')
const Config                      = require('../utils/Config')
const artifact                    = require('../artifacts/frey.json')

const {hexToNumber}  = require('@harmony-js/utils')
const {MessageEmbed} = require('discord.js')
const axios          = require('axios')
const {numberToHex}  = require("@harmony-js/utils")
const moment         = require('moment')
const {Wallet}       = require("../utils")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`frey`)
        .setDescription(`This command is a way to show off your Frey. It will show an image and all it's statistics`)
        .addNumberOption(option => option.setRequired(true).setName('id').setDescription(`Enter the Frey ID`)),

    async execute(interaction)
    {
        // Defer reply
        await interaction.deferReply({ephemeral: false})

        // Options
        const id = interaction.options.getNumber('id')

        // Get data
        const wallet     = await Wallet.get(interaction, interaction.id)
        const privateKey = await Wallet.privateKey(wallet)
        const provider   = new ethers.providers.JsonRpcProvider(Config.get('token.rpc_url'))
        const options    = {gasPrice: await provider.getGasPrice(), gasLimit: 250000}
        const signer     = new ethers.Wallet(privateKey, provider)
        const contract   = new ethers.Contract(artifact.address, artifact.abi, provider).connect(signer)
        const freyInfo   = await contract.nfts(id, options)

        axios.get(`https://frey.freyala.com/meta?meta=${id}`).then(async response => {
            const frey      = response.data
            const block     = await provider.getBlock(freyInfo.blockBorn.toNumber())
            const timestamp = block.timestamp
            const age       = moment.duration(moment().diff(moment.unix(timestamp)), 'milliseconds')

            const embed = new MessageEmbed()
                .setColor(Config.get('colors.primary'))
                .setThumbnail(Config.get('token.thumbnail'))
                .setTitle(frey.name)
                .setDescription(frey.description)
                .addField(`Owner`, `${freyInfo[4].substr(0, 6)}...${freyInfo[4].substr(-6, 6)}`)
            if (freyInfo[0] !== '') {
                embed.addField(`Name`, freyInfo[0])
            }

            embed
                .addField(`Age`, `${age.years()}y ${age.months()}m ${age.days()}d ${age.hours()}h`)
                .setImage(frey.image)

            await interaction.editReply({embeds: [embed]})
        })
    },
}