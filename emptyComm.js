const { SlashCommandBuilder } = require('@discordjs/builders')

/**
 * @description 
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('')
        .setDescription(''),
    async execute(interaction) {
        // await interaction.reply('')
    },
}