const fs = require('fs')
const tls = require('tls')

const options = {
    key: fs.readFileSync('./client.pem'),
    cert: fs.readFileSync('./client-cert.pem'),
    ca: [fs.readFileSync('./server-cert.pem')],
    servername: 'localhost'
}

const clientStream = tls.connect(8000, options, () => {
    const authorized = clientStream.authorized ? 'authorized' : 'unauthorized'
    console.log(`Connected: ${authorized}`)
    process.stdin.pipe(clientStream)
})

clientStream.setEncoding('utf8')
clientStream.on('data', (data) => {
    console.log(data)
})