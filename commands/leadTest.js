const { SlashCommandBuilder } = require('@discordjs/builders')

/**
 * @description Slash Command to test creating a Lead in Salesforce and getting
 * all of the data for the once it has been created in Salesforce
 */

module.exports = {
    data : new SlashCommandBuilder()
        .setName('leadtest')
        .setDescription('create a generic lead in my SF playground'),
    async execute(interaction) {
        let reply = ''
        let id = ''

        await fetch(`${interaction.client.sf.instance_url}/services/data/v54.0/sobjects/Lead`, {
            method  : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `${interaction.client.sf.token_type} ${interaction.client.sf.access_token}`
            },
            body    : JSON.stringify({
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
            })
        })  .then(response => response.json())
            .then(async (data) => {
                console.log('success', data)
                reply += `new Lead Id : ${data.id}\n`
                id = data.id
                //await interaction.reply(`new Lead Id :${data.id}`)
            })
            .catch((error) => {
                console.log('Error: ', error)
            })
    
        await fetch(`${interaction.client.sf.instance_url}/services/data/v54.0/sobjects/Lead/${id}`, {
            method : 'GET',
            headers : {
                'Content-Type'  : 'application/json',
                'Authorization' : `${interaction.client.sf.token_type} ${interaction.client.sf.access_token}`
            }
        })  .then(response => response.json())
            .then(async(data) => {
                console.log('success', data)
                reply += `Lead Name : ${data.Name}`
            })
            .catch((error) => {
                console.log('Error: ', error)
            })
        
        await interaction.reply(reply)
        interaction.client.leadNum++
    },
}