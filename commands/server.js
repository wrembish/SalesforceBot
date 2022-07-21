const { SlashCommandBuilder } = require('@discordjs/builders')

/**
 * @description Example slash command of getting different information about a server
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Replies with server info!'),
    async execute(interaction) {
        await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`)
    },
}