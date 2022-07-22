const { SlashCommandBuilder } = require('@discordjs/builders')

/**
 * @description 
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testguildids')
        .setDescription('Testing Command to Test Guild Id Objects in SF'),
    async execute(interaction) {
        const helpers = require('../helperFunctions.js')
        const queryStr = `SELECT+Id,Name+from+GuildId__c`
        let records = await helpers.soql(queryStr, interaction.client.sf)
        // await interaction.reply('')
        if(records.totalSize > 0) {
            let reply = ''
            records.records.forEach((record) => { reply += record.Name + '\n' })
            await interaction.reply(reply)
        } else {
            await interaction.reply('No Records To Display')
        }
    },
}