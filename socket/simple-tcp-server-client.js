const assert = require('assert')
const net = require('net')

let clientId = 0
let expectedAssertions = 2

const server = net.createServer(client => {
    clientId++
    console.log(`Client connected ${clientId}`)

    client.on('end', () => {
        console.log(`Client disconnected ${clientId}`)
    })

    client.write(`Welcome client ${clientId} \n`)
    client.pipe(client)
})

server.listen(8000, () => {
    console.log('Server started on 8000')

    function runTest(expectedId, done) {
        const client = net.connect(8000)

        client.on('data', (data) => {
            const expected = `Welcome client ${expectedId} \n`
            assert.equal(expected, data.toString())
            expectedAssertions--
            client.end()
        })

        client.on('end', done)
    }

    runTest(1, () => {
        runTest(2, () => {
            console.log('Tests finished')
            assert.equal(0, expectedAssertions)
            server.close()
        })
    })
})