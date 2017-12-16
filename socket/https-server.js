const fs = require('fs')
const https = require('https')

const options = {
    // 私钥
    key: fs.readFileSync('./server.pem'),
    // 公钥
    cert: fs.readFileSync('./server-cert.pem'),
    // 客户端验证证书
    ca: [fs.readFileSync('./client-cert.pem')],
    // 确保客户端证书都要被检查
    requestCert: true
}

const server = https.createServer(options, (request, response) => {
    const authorized = clientStream.authorized ? 'authorized' : 'unauthorized'
    console.log(`Connected: ${authorized}`)
    response.writeHead(200)
    response.write(`Welcome ${authorized}`)
    response.end()
}).listen(8000, () => {
    console.log('Server listening on 8000')
})