const { SlashCommandBuilder } = require('@discordjs/builders')

/**
 * @description Testing Command to Test Guild Id Object in my Salesforce org
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testguildids')
        .setDescription('Testing Command to Test Guild Id Objects in SF'),
    async execute(interaction) {
        const helpers = require('../helperFunctions.js')
        const queryStr = `SELECT+Id,Name+from+GuildId__c`
        let result = await helpers.soql(queryStr, interaction.client.sf)
        if(result.totalSize > 0) {
            let reply = ''
            result.records.forEach((record) => { reply += record.Name + '\n' })
            await interaction.reply(reply)
        } else {
            await interaction.reply('No Records To Display')
        }
    },
}