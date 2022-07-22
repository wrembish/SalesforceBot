const COMMAND_CHAR = '#'

module.exports = {
    name : 'messageCreate',
    async execute(message) {
        if(message.author.id === message.client.user.id) return

        const helpers = require('../helperFunctions.js')
        const sf = message.client.sf
        
        const currGuildId = message.guild.id
        const guildIdQuery = `SELECT+Id,Name+from+GuildId__c`
        const guildIdResult = await helpers.soql(guildIdQuery, sf)

        let isIn = false
        if(guildIdResult.totalSize >= 0) { guildIdResult.records.forEach((record) => { if(record.Name === currGuildId) isIn = true; }) }
        if(!isIn) { await helpers.insert('GuildId__c', { Name : currGuildId }, sf) }

        const content = message.content
        
        if(content.startsWith(COMMAND_CHAR) && content !== COMMAND_CHAR) {
            if(content.split(' ').length === 1 && content.length > 2) {
                const dieCountName = content.substring(1)
                const queryStr = `SELECT+Id,Name,Count__c+from+DieCount__c+WHERE+Name='${dieCountName}'+LIMIT+1`
                const result = await helpers.soql(queryStr, sf)

                let reply = ''
                let body = { Name  : dieCountName }

                if(result.totalSize === 0) {
                    reply = `Congrats ${dieCountName} you now have 1 :electric_plug: Disconnet :electric_plug:`
                    body.Count__c = 1
                } else {
                    body.Count__c = result.records[0].Count__c+1
                    reply = `Current Toll for ${dieCountName}: ${body.Count__c}`
                }

                await helpers.upsert('DieCount__c', 'Ext_Id__c', dieCountName, body, sf)

                await message.channel.send(reply)
            }
        }
    },
}