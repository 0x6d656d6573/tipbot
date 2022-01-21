const {SlashCommandBuilder} = require('@discordjs/builders')
const {MessageEmbed}        = require("discord.js")
const {Config}              = require("../utils")
const table                 = require("text-table")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`help`)
        .setDescription(`Not sure where to start? Let me guide you.`),

    async execute(interaction)
    {
        // Send embed
        const embed = new MessageEmbed()
            .setColor(Config.get('colors.primary'))
            .setThumbnail(Config.get('token.thumbnail'))
            .setTitle(`📚 Help`)
            .setDescription(`This command is still undergoing a revamp. Please visit [our guide](https://docs.freyala.com/freyala/discord-bot) for info. Tag @Gyd0x if you are still stuck after reading the guide`)

        await interaction.reply({embeds: [embed], ephemeral: true})
    },
}