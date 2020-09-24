const updateTemplate = require('./updateTemplate')
const updateMapping = require('./updateMapping')
const copyProperty = require('./copyProperty')

const main = async function() {
    const updatedTemplate = await updateTemplate('some-index', {
        myNewProperty: {
            type: 'keyword'
        }
    })
    const updatedMapping = await updateMapping('some-index', {
        myNewProperty: {
            type: 'keyword'
        }
    })

    console.time('exection_time')

    const updatedDocuments = await copyProperty({
        fromIndex: 'source-index',
        toIndex: 'destination-index',
        property: 'myNewProperty',
        matchProperty: 'documentIdentifier'
    })

    console.log('Updated documents:', updatedDocuments)

    console.timeEnd('exection_time')
}

main()