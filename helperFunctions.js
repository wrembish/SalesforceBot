module.exports = {
    async auth() {
        let sf
        await fetch('https://login.salesforce.com/services/oauth2/token', {
            method  : 'POST',
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded',
            },
            body    :
                'grant_type=password' +
                `&client_id=${process.env.SF_CONSUMER_KEY}` +
                `&client_secret=${process.env.SF_CONSUMER_SECRET}` +
                `&username=${process.env.SF_USERNAME}` +
                `&password=${process.env.SF_PASSWORD}${process.env.SF_SECURITY_TOKEN}`
        })  .then(response => response.json())
            .then(data => {
                console.log('Successfully Connected to Salesforce!')
                sf = data
            })
            .catch((error) => {
                console.log('Error: ', error)
            })
        return sf
    },
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
                records = data
            })
            .catch((error) => {
                console.log('Error: ', error)
            })
        return records
    },
    async testAuth(sf) {
        let test = await this.soql('SELECT+Id+from+Lead+LIMIT+1', sf)
        return !test.totalSize
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
        if(records.totalSize > 0) {
            records.records.forEach((record) => {
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