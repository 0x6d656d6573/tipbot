const {SlashCommandBuilder} = require('@discordjs/builders')
const git                   = require('git-rev-sync')
const {MessageEmbed}        = require("discord.js")
const {Config}              = require("../utils")
const table                 = require("text-table")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version')
        .setDescription(`Shows the current version`),
    
    async execute(interaction)
    {
        // Send embed
        const embed = new MessageEmbed()
            .setColor(Config.get('colors.primary'))
            .setThumbnail(Config.get('token.thumbnail'))
            .setTitle(`Sir Reginald version`)
            .setDescription('```' + git.tag(false) + '```')

        await interaction.reply({embeds: [embed], ephemeral: true}) 
    },
}