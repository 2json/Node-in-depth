const fs = require('fs')
const https = require('https')
const os = require('os')

const options = {
    key: fs.readFileSync('./client.pem'),
    cert: fs.readFileSync('./client-cert.pem'),
    ca: [fs.readFileSync('./server-cert.pem')],
    hostname: os.hostname(),
    port: 8000,
    path: '/',
    method: 'GET'
}

const request = https.request(options, (response) => {
    response.on('data', (data) => {
        process.stdout.write(data)
    })
})

request.on('error', (error) => {
    console.log(error)
})

request.end()
