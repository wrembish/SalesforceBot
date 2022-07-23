const { SlashCommandBuilder } = require('@discordjs/builders')

/**
 * @description Test command to test the upsert helper function
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upserttest')
        .setDescription('test upsert insert and update'),
    async execute(interaction) {
        const helpers = require('../helperFunctions.js')
        const sf = interaction.client.sf

        const insertResult = await helpers.upsert('upsertTest__c', 'Ext_Id__c', 'insertTest', { Name  : 'This was inserted' }, sf)
        console.log(insertResult)
        console.log(await helpers.upsert('upsertTest__c', 'Ext_Id__c', 'updateTest', { Name  : 'This was updated' }, sf))
        
        await helpers.delete('upsertTest__c', insertResult.id, sf)
        
        await interaction.reply('success')
    },
}