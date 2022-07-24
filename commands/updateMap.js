const { SlashCommandBuilder } = require('@discordjs/builders')

/**
 * @description Command to update the current conversion map from Salesforce
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('updatemap')
        .setDescription('Command to update the current conversion map from Salesforce'),
    async execute(interaction) {
        const helpers = require('../helperFunctions.js')

        const testAuth = await helpers.testAuth(interaction.client.sf)
        if(testAuth) {  interaction.client.sf = await helpers.auth() }

        interaction.client.conversionMap = await helpers.getMap(interaction.client.sf)
        await interaction.reply('We Did It Boys')
    },
}