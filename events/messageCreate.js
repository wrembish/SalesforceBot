const COMMAND_CHAR = '#'
const helpers = require('../helperFunctions.js')

module.exports = {
    name : 'messageCreate',
    async execute(message) {
        if(message.author.id === message.client.user.id) return

        let testAuth = await helpers.testAuth(message.client.sf)

        if(!message.client.guildIds) {
            if(testAuth) message.client.sf = await helpers.auth()

            let guildIds = await helpers.soql(`SELECT+Id,Name+from+GuildId__c`, message.client.sf)
            message.client.guildIds = guildIds.records.map(value => { return value.Name })
        }
        
        const currGuildId = message.guildId
        if(message.client.guildIds && !message.client.guildIds.includes(currGuildId)) {
            testAuth = await helpers.testAuth(message.client.sf)
            if(testAuth) message.client.sf = await helpers.auth()
            
            await helpers.insert('GuildId__c', { Name : currGuildId }, message.client.sf)
            message.client.guildIds.push(currGuildId)
        }

        const sf = message.client.sf

        const content = message.content
        
        if(content.startsWith(COMMAND_CHAR) && content !== COMMAND_CHAR) {
            if(content.split(' ').length === 1 && content.length > 2) {
                testAuth = await helpers.testAuth(message.client.sf)
                if(testAuth) {  message.client.sf = await helpers.auth(); sf = message.client.sf }
                
                const dieCountName = content.substring(1)
                const result = await helpers.soql(`SELECT+Id,Name,Count__c+from+DieCount__c+WHERE+Name='${dieCountName}'+LIMIT+1`, sf)

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
        } else if(content.toLowerCase().startsWith('new') && content.includes(':')) {
            testAuth = await helpers.testAuth(message.client.sf)
            if(testAuth) { message.client.sf = await helpers.auth(); sf = message.client.sf }

            let obj
            if(content.split(':')[0].split(' ').length < 2) {
                obj = content.substring(3).split(':')[0].trimStart().trimEnd()
            } else{
                obj = content.split(':')[0].split(' ')[1].trimStart().trimEnd()
            }
            let body = {}
            content.split(':')[1].split(',').forEach(val => {
                if(val.includes('=')) {
                    const key = val.split('=')[0].trimStart().trimEnd()
                    const value = val.split('=')[1].trimStart().trimEnd()
                    if(key.toLowerCase() === 'name' && (obj.toLowerCase() === 'lead' || obj.toLowerCase() === 'contact')) {
                        if(value.split(' ').length > 1) {
                            body.FirstName = value.split(' ')[0]
                            body.LastName = value.split(' ')[1]
                        } else {
                            body.LastName = value
                        }
                    } else {
                        body[key] = value
                    }
                }
            })
            const result = await helpers.insert(obj, body, sf)
            await message.channel.send(result.id ? `New ${obj} Id: ${result.id}` : result[0].message)
        }
    },
}