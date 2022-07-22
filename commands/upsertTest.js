const { SlashCommandBuilder } = require('@discordjs/builders')

/**
 * @description 
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upserttest')
        .setDescription('test upsert insert and update'),
    async execute(interaction) {
        const helpers = require('../helperFunctions.js')
        const sf = interaction.client.sf

        let body = {
            'Name'  : 'This was inserted'
        }

        let result = await helpers.upsert('upsertTest__c', 'Ext_Id__c', 'insertTest', body, sf)
        console.log(result)

        body = {
            'Name'  : 'This was updated'
        }
        
        result = await helpers.upsert('upsertTest__c', 'Ext_Id__c', 'updateTest', body, sf)
        console.log(result)
        await interaction.reply('success')
    },
}