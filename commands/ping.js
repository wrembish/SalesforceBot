const { SlashCommandBuilder } = require('@discordjs/builders')

/**
 * @description Generic Slash Command, kind of the "Hello World" of Discord Bots
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply('Pong!')
    },
}