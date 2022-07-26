const { SlashCommandBuilder } = require('@discordjs/builders')

/**
 * @description Help on how to manipulate records in SF with discord messages
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('How do I manipulate records in Salesforce with discord messages?'),
    async execute(interaction) {
        let reply = 'To insert a new record, type "New sObjectName : Field = FieldValue, NextField = NextFieldValue, ..."\n' +
                    'To update a recrod, type "Update sObjectName RecordId : Field = NewFieldValue, NextField = NextNewFieldValue, ..."'
        await interaction.reply(reply)
    },
}