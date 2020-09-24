const client = require('./elastic')
const _ = require('lodash')

// Test exists error
// Test with version increment
// Test without version increment
// Test updating properties

const updateMapping = async function(index, properties) {
    const current = await client.indices.getMapping({
            index
        })
        .then(({ body }) => body[index])
        .catch(err => { throw Error('mapping does not exist') })

    const firstMappingKey = Object.keys(current.mappings)[0]

    return client.indices.putMapping({
        index,
        type: firstMappingKey,
        body: {
        	properties
        }
    }).then(({body}) => body.acknowledged)
}

module.exports = updateMapping