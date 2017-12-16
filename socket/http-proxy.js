const http = require('http')
const url = require('url')

http.createServer((request, response) => {
    console.log(`Start request: ${request.url}`)
    // 解析url对象
    const options = url.parse(request.url)
    options['headers'] = request.headers
    console.log(options)
    // 创建代理请求
    const proxyRequest = http.request(options, (proxyResponse) => {
        proxyResponse.on('data', (chunk) => {
            console.log(`proxyResponse length: ${chunk.length}`)
            response.write(chunk, 'binary')
        })
        proxyResponse.on('end', () => {
            console.log('Proxied request ended')
            response.end()
        })
        response.writeHead(proxyResponse.stat∑usCode, proxyResponse.headers)
    })

    request.on('data', (chunk) => {
        console.log(`In request length ${chunk.length}`)
        proxyRequest.write(chunk, 'binary')
    })

    request.on('end', () => {
        console.log(`Original request ended`)
        proxyRequest.end()
    })
}).listen(8000)