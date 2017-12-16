const fs = require('fs')
const tls = require('tls')

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

const server = tls.createServer(options, (clientStream) => {
    const authorized = clientStream.authorized ? 'authorized' : 'unauthorized'
    console.log(`Connected: ${authorized}`)
    clientStream.write('Welcome!\n')
    clientStream.setEncoding('utf8')
    clientStream.pipe(clientStream)
}).listen(8000, () => {
    console.log('Server listening on 8000')
})