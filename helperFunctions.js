module.exports = {
    async soql(queryStr, sf) {
        let records
        await fetch(`${sf.instance_url}/services/data/v54.0/query/?q=${queryStr}`, {
            method : 'GET',
            headers : {
                'Content-Type'  : 'application/json',
                'Authorization' : `${sf.token_type} ${sf.access_token}`
            }
        })  .then(response => response.json())
            .then(async(data) => {
                console.log('success')
                if(data.totalSize > 0) {
                    records = data.records
                }
            })
            .catch((error) => {
                console.log('Error: ', error)
            })
        return records
    },
    async insert(object, body, sf) {
        let result
        await fetch(`${sf.instance_url}/services/data/v54.0/sobjects/${object}`, {
            method  : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `${sf.token_type} ${sf.access_token}`
            },
            body    : JSON.stringify(body)
        })  .then(response => response.json())
            .then(async (data) => {
                console.log('success')
                result = data
            })
            .catch((error) => {
                console.log('Error: ', error)
            })
        return result
    },
    async update(object, id, body, sf) {
        let result
        await fetch(`${sf.instance_url}/services/data/v54.0/sobjects/${object}/${id}`, {
            method  : 'PATCH',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `${sf.token_type} ${sf.access_token}`
            },
            body    : JSON.stringify(body)
        })  .then(async (data) => {
                console.log('success')
                result = data
            })
            .catch((error) => {
                console.log('Error: ', error)
            })
        return result
    },
    async upsert(object, externalIdFieldName, externalId, body, sf) {
        let result
        await fetch(`${sf.instance_url}/services/data/v54.0/sobjects/${object}/${externalIdFieldName}/${externalId}`, {
            method  : 'PATCH',
            headers : {
                'Content-Type'  : 'application/json',
                'Authorization' : `${sf.token_type} ${sf.access_token}`
            },
            body    : JSON.stringify(body)
        })  .then(response => response.json())
            .then(async (data) => {
                console.log('success')
                result = data
            })
            .catch((error) => {
                console.log('Error: ', error)
            })
        return result
    },
    async delete(object, id, sf) {
        let response = false
        await fetch(`${sf.instance_url}/services/data/v54.0/sobjects/${object}/${id}`, {
            method  : 'DELETE',
            headers : {
                'Authorization' : `${sf.token_type} ${sf.access_token}`
            }
        })  .then(async () => {
                console.log('success')
                response = true
            })
            .catch((error) => {
                console.log('Error: ', error)
            })
        return response
    },
    async getRecordById(object, id, sf) {
        let result
        await fetch(`${sf.instance_url}/services/data/v54.0/sobjects/${object}/${id}`, {
            method : 'GET',
            headers : {
                'Content-Type'  : 'application/json',
                'Authorization' : `${sf.token_type} ${sf.access_token}`
            }
        })  .then(response => response.json())
            .then(async(data) => {
                console.log('success')
                result = data
            })
            .catch((error) => {
                console.log('Error: ', error)
            })
        return result
    },
    async getMap(sf) {
        const queryStr = `SELECT+Id,Name,Char__c+from+Emoji__c`
        let records = await this.soql(queryStr, sf)
        let map = {}
        if(records) {
            records.forEach((record) => {
                const key = record.Char__c.toUpperCase()
                if(map[key]) {
                    map[key].push(record.Name)
                } else {
                    map[key] = [record.Name]
                }
            })
        }

        return map
    },
    async convert(str, client) {
        // console.log(await helpers.convert('hello world', interaction.client))
        let output = {
            update_map : false,
            map : {},
            result : ''
        }
        if(!client.conversionMap) {
            output.update_map = true
            output.map = await this.getMap(client.sf)
        }

        let map = output.update_map ? output.map : client.conversionMap

        str = str.toUpperCase()
        for(const c of str.split('')) {
            if(c === ' ') output.result += '    '
            else output.result += map[c][Math.floor(Math.random() * map[c].length)] + ' '
        }

        return output
    }
}