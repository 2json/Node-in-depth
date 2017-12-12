const assert = require('assert')
const http = require('http')

// 创建一个http服务器
const server = http.createServer((request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    })
    response.write('Hello world \n\n')
    response.end()
})
.listen(8000, () => {
    console.log('Listening on port 8000')
})

// 发送一个http请求
http.request({
    port: 8000
}, (response) => {
    console.log(`HTTP headers: ${JSON.stringify(response.headers)}`)
    // 监听data事件，接收请求发送过来的数据
    response.on('data', (data) => {
        console.log(`Body: ${data.toString()}`)
        assert.equal('Hello world \n\n', data.toString())
        assert.equal(200, response.statusCode)
        server.unref()
    })
}).end()