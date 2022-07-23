const { SlashCommandBuilder } = require('@discordjs/builders')

/**
 * @description Slash Command to test creating a Lead in Salesforce and getting
 * all of the data for the Lead once it has been created in Salesforce then
 * deleting it
 */

module.exports = {
    data : new SlashCommandBuilder()
        .setName('leadtest')
        .setDescription('create a generic lead in my SF playground'),
    async execute(interaction) {
        let helpers = require('../helperFunctions.js')
        let sf = interaction.client.sf
        let reply = ''
        let id
        let body = {
            "street" : "23128 Pine Run",
            "city" : "Millsboro",
            "state" : "Delaware",
            "PostalCode" : "19966",
            "Country" : "United States",
            "FirstName" : `Will${interaction.client.leadNum}`,
            "LastName" : "Rembish",
            "Email" : "will002@testing.com",
            "Phone" : "3022782988",
            "Description" : "Test Description",
            "Company" : "no"
        }

        const result = await helpers.insert('Lead', body, sf)
        if(result) {
            reply += `new Lead Id : ${result.id}\n`
            id = result.id
        }

        if(id) {
            const resultGet = await helpers.getRecordById('Lead', id, sf)
            if(resultGet) {
                reply += `Lead Name : ${resultGet.Name}`
            }
        }

        let success = await helpers.delete('Lead', id, sf)
        if(success) reply += '\n\nSuccessfully Deleted Lead'
        else reply += '\n\n Lead Deletion Failed'
        
        await interaction.reply(reply)
        interaction.client.leadNum++
    },
}