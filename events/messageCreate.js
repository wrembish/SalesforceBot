const COMMAND_CHAR = '#'

module.exports = {
    name : 'messageCreate',
    async execute(message) {
        if(message.author.id === message.client.user.id) return

        const helpers = require('../helperFunctions.js')
        const sf = message.client.sf
        let queryStr = `SELECT+Id,Name+from+GuildId__c`
        let records = await helpers.soql(queryStr, sf)
        const currGuildId = message.guild.id
        let isIn = false
        if(records) { records.forEach((record) => { if(record.Name === currGuildId) isIn = true; }) }
        if(!isIn) {
            const body = {
                "Name" : currGuildId
            }
            await helpers.insert('GuildId__c', body, sf)
        }

        const content = message.content

        if(content.startsWith(COMMAND_CHAR)) {
            if(content.split(' ').length <= 1 && content.split(COMMAND_CHAR).length > 1) {
                const dieCountName = content.split(COMMAND_CHAR)[1];
                if(dieCountName.length < 2) return;
                queryStr = `SELECT+Id,Name,Count__c+from+DieCount__c+WHERE+Name='${dieCountName}'+LIMIT+1`
                records = await helpers.soql(queryStr, sf)

                let reply = ''
                if(records.totalSize <= 0) {
                    reply += `Congrats ${dieCountName} you now have 1 :electric_plug: Disconnet :electric_plug:`

                    const body = {
                        "Name"      : dieCountName,
                        "Count__c"  : 1
                    }

                    helpers.insert('Die_Count__c', body, sf)
                } else {
                    const record = records[0]
                    record.Count__c += 1
                    reply += `Current Toll for ${record.Name}: ${record.Count__c}`

                    const body = {
                        "Count__c" : record.Count__c
                    }

                    helpers.update('DieCount__c', record.Id, body, sf)
                }

                await message.channel.send(reply)
            } else if(content.split(' ').length === 2 && content.split(COMMAND_CHAR).length > 1) {

            }

            // if(content === '!!ping') await message.channel.send('Pong!')
        }
    },
}