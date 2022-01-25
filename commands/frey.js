const {SlashCommandBuilder, time} = require('@discordjs/builders')
const {ethers}                    = require('ethers')
const Config                      = require('../utils/Config')
const freyArtifact                = require('../artifacts/frey.json')
const marketplaceArtifact         = require('../artifacts/marketplace.json')
const nftKeyArtifact              = require('../artifacts/nftkey.json')
const {hexToNumber}               = require('@harmony-js/utils')
const {MessageEmbed}              = require('discord.js')
const axios                       = require('axios')
const {numberToHex}               = require("@harmony-js/utils")
const moment                      = require('moment')
const {Wallet}                    = require("../utils")
const table                       = require('text-table')

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
        const wallet       = await Wallet.get(interaction, interaction.id)
        const privateKey   = await Wallet.privateKey(wallet)
        const provider     = new ethers.providers.JsonRpcProvider(Config.get('token.rpc_url'))
        const options      = {gasPrice: await provider.getGasPrice(), gasLimit: 250000}
        const signer       = new ethers.Wallet(privateKey, provider)
        const freyContract = new ethers.Contract(freyArtifact.address, freyArtifact.abi, provider).connect(signer)
        const freyInfo     = await freyContract.nfts(id, options)

        // Marketplace Listings
        const currencies = {
            '0x0000000000000000000000000000000000000000': 'ONE',
            '0x9b68BF4bF89c115c721105eaf6BD5164aFcc51E4': 'XYA',
            '0xE59AA7f9e91B4Cc6C25D3542CEcb851e0316138c': 'YIN',
            '0x340042552D19211795dbe55d84FA2E63bc49B890': 'YIN',
        }

        // Freyala Marketplace
        let marketplaceSaleRows   = []
        const marketplaceContract = new ethers.Contract(marketplaceArtifact.address, marketplaceArtifact.abi, provider).connect(signer)

        // Sell order
        let marketplaceSellOrder = false
        let marketplaceSellPrice = null
        let marketplaceSellCurrency = null
        try {
            marketplaceSellOrder = await marketplaceContract.getSellOrder(freyArtifact.address, id)
            marketplaceSellPrice = parseFloat(ethers.utils.formatUnits(marketplaceSellOrder.price)).toFixed(2)
            marketplaceSellCurrency = currencies[marketplaceSellOrder.currency]
        } catch (error) {
            marketplaceSellOrder = false
        }
        if (marketplaceSellOrder) {
            marketplaceSaleRows.push(['Price', `${marketplaceSellPrice} ${marketplaceSellCurrency}`])
        }

        // Auction
        let marketplaceAuctionRows     = []
        let marketplaceAuction         = false
        let marketplaceAuctionPrice    = null
        let marketplaceAuctionCurrency = null
        let marketplaceAuctionEnds     = null
        let marketplaceAuctionEnded    = false
        try {
            marketplaceAuction      = await marketplaceContract.getAuction(freyArtifact.address, id)
            marketplaceAuctionEnded = marketplaceAuction.ended
            if (marketplaceAuctionEnded) {
                marketplaceAuction = false
            } else {
                marketplaceAuctionEnds  = moment.unix(ethers.utils.formatUnits(marketplaceAuction.endsAt) * 10 ** 18).fromNow()
                marketplaceAuctionPrice = parseFloat(ethers.utils.formatUnits(marketplaceAuction.highestBid)).toFixed(2)
                marketplaceAuctionCurrency = currencies[marketplaceAuction.currency]
            }
        } catch (error) {
            marketplaceAuction = false
        }
        if (marketplaceAuction) {
            marketplaceAuctionRows.push(['Price', `${marketplaceAuctionPrice} ${marketplaceAuctionCurrency}`])
            marketplaceAuctionRows.push(['Ends', marketplaceAuctionEnds])
        }

        // NFTKEY Marketplace
        let nftkeyRows       = []
        const nftKeyContract = new ethers.Contract(nftKeyArtifact.address, nftKeyArtifact.abi, provider).connect(signer)
        const nftKeyInfo     = await nftKeyContract.getTokenListing(freyArtifact.address, id)
        const nftKeyPrice    = parseFloat(ethers.utils.formatUnits(nftKeyInfo[1])).toFixed(2)
        const nftKeyListed   = parseFloat(nftKeyPrice) > 0
        if (nftKeyListed) { 
            nftkeyRows.push([nftKeyPrice, 'ONE'])
        }

        // Frey meta
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
            if (marketplaceSaleRows.length > 0) {
                embed.addField(`Marketplace listing (Sale)`, '```' + table(marketplaceSaleRows) + '```')
            }
            if (marketplaceAuctionRows.length > 0) {
                embed.addField(`Marketplace listing (Auction)`, '```' + table(marketplaceAuctionRows) + '```')
            }
            if (nftkeyRows.length > 0) {
                embed.addField(`NFTKEY Listing`, '```' + table(nftkeyRows) + '```')
            }

            await interaction.editReply({embeds: [embed]})
        })
    },
}