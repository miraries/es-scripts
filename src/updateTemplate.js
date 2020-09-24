const client = require('./elastic')
const _ = require('lodash')

// Test exists error
// Test with version increment
// Test without version increment
// Test updating properties

const updateTemplate = async function(index, properties) {
    const exists = await client.indices.existsTemplate({
        name: index
    }).then(({ body }) => body)

    if (!exists)
        throw Error('template does not exist')

    const current = await client.indices.getTemplate({
        name: index
    }).then(({ body }) => body[index])

    const newVersion = (current.version || 0) + 1
    const firstMappingKey = Object.keys(current.mappings)[0]

    const newProps = {
        version: newVersion,
        mappings: {
        	[firstMappingKey]: {
        		properties: {
        			...properties
        		}
        	}
        }
    }

    const updated = _.merge(current, newProps)

    return client.indices.putTemplate({
    	name: index,
    	body: updated
    }).then(({body}) => body.acknowledged)
}

module.exports = updateTemplate