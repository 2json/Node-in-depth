const dgram = require('dgram')
const fs = require('fs')
const port = 41230
const defaultSize = 16

function Client(remoteIp) {
    const stream = fs.createReadStream(__filename)
    const socket = dgram.createSocket('udp4')

    function sendData() {
        const message = stream.read(defaultSize)
        
        if(!message) {
            return socket.unref()
        }

        socket.send(message, 0, message.length, port, remoteIp, (error, bytes) => {
            sendData()
        })
    }

    stream.on('readable', () => {
        sendData()
    })
}

function Server() {
    const socket = dgram.createSocket('udp4')

    socket.on('message', (message, info) => {
        process.stdout.write(message.toString())
    })

    socket.on('listening', () => {
        console.log(`Server ready ${socket.address()}`)
    })

    socket.bind(port)
}

if(process.argv[2] === 'client') {
    new Client(process.argv[3])
}else {
    new Server()
}