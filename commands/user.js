const { SlashCommandBuilder } = require('@discordjs/builders')

/**
 * @description Example slash command of getting different information about the command user
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Replies with user info!'),
    async execute(interaction) {
        await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`)
    },
}