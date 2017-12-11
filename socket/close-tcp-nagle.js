const net = require('net')

const server = net.createServer(client => {
    client.setNoDelay(true)
    client.write('12345678987654321234', 'binary')

    console.log('Server connected')

    client.on('end', () => {
        console.log('Server disconnected')
        server.unref()
    })

    client.on('data', (data) => {
        process.stdout.write(data.toString())
        client.write(data.toString())
    })
})

server.listen(8000, () => {
    console.log('Server bounded on 8000')
})