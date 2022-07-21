const { clientId } = require('../config.json')

module.exports = {
    name : 'messageCreate',
    async execute(message) {
        if(message.author.id === clientId) return

        const content = message.content

        if(content === '!!ping') await message.channel.send('Pong!')

        if(content.startsWith('#')) {
            if(content.split(' ').length <= 1 && content.split('#').length > 1) {
                const dieCountName = content.split('#')[1];
                const queryStr = `SELECT+Id,Name,Count__c+from+DieCount__c+WHERE+Name='${dieCountName}'+LIMIT+1`
                const sf = message.client.sf
                let records
                await fetch(`${sf.instance_url}/services/data/v54.0/query/?q=${queryStr}`, {
                    method : 'GET',
                    headers : {
                        'Content-Type'  : 'application/json',
                        'Authorization' : `${sf.token_type} ${sf.access_token}`
                    }
                })  .then(response => response.json())
                    .then(async(data) => {
                        console.log('success', data)
                        records = data
                    })
                    .catch((error) => {
                        console.log('Error: ', error)
                    })

                let reply = ''
                if(records.totalSize <= 0) {
                    reply += `Congrats ${dieCountName} you now have 1 :electric_plug: Disconnet :electric_plug:`
                    await fetch(`${sf.instance_url}/services/data/v54.0/sobjects/DieCount__c`, {
                        method  : 'POST',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : `${sf.token_type} ${sf.access_token}`
                        },
                        body    : JSON.stringify({
                            "Name" : dieCountName,
                            "Count__c" : 1
                        })
                    }).then(response => response.json()).then(async (data) => { console.log('success', data) }) .catch((error) => { console.log('Error: ', error) })
                } else {
                    const record = Array.from(records.records)[0]
                    console.log(record)
                    record.Count__c += 1
                    reply += `Current Toll for ${record.Name}: ${record.Count__c}`
                    await fetch(`${sf.instance_url}/services/data/v54.0/sobjects/DieCount__c/${record.Id}`, {
                        method  : 'PATCH',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : `${sf.token_type} ${sf.access_token}`
                        },
                        body    : JSON.stringify({
                            "Count__c" : record.Count__c
                        })
                    }).then(response => response).then(async (data) => { console.log('success') }).catch((error) => { console.log('Error: ', error) })
                }

                await message.channel.send(reply)
            }
        }
    },
}