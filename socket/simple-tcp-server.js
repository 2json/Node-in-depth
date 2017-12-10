const net = require('net')
let clientId = 0

const server = net.createServer((client) => {
    clientId++
    console.log(`Client connected: ${clientId}`)

    client.on('end', () => {
        console.log(`Client disconnected: ${clientId}`)
    })

    client.write(`Welcome client ${clientId} in\n`)
    client.pipe(client)
})

server.listen(8000, () => {
    console.log('Server started on port 8000')
})