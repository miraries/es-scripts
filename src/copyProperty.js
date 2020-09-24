const client = require('./elastic')
const scrollSearch = require('./scrollSearch.js')

/**
 * Copy value from one index to another
 * 
 * @param {Object} options
 * @param {string} options.fromIndex - Source index
 * @param {string} options.toIndex - Destination index
 * @param {string} options.property - Property to copy
 * @param {string} options.matchProperty - Which property in toIndex matches _id in fromIndex
 */
const copyProperty = async function(options) {
    const {
        fromIndex,
        toIndex,
        property,
        matchProperty
    } = options

    const scrollParams = {
        index: fromIndex,
        scroll: '30s',
        size: 500,
        _source: [property],
        body: {
            query: {
                match_all: {}
            }
        }
    }

    let updatedDocuments = 0

    for await (const hit of scrollSearch(scrollParams)) {
        const hitId = hit._id
        const hitValue = hit._source[property]

        await client.updateByQuery({
            index: toIndex,
            refresh: true,
            body: {
                script: {
                    lang: 'painless',
                    source: `ctx._source.${property} = '${hitValue}'`
                },
                query: {
                    match: {
                        [matchProperty]: hitId
                    }
                }
            }
        })

        updatedDocuments++
    }

    return updatedDocuments
}

module.exports = copyProperty