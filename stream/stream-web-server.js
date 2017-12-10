const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
    fs.readFile(__dirname + '/index.html', (error, data) => {
        if(error) {
            res.statusCode = 500
            res.end(String(error))
        }else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            })
            res.end(data)
        }
    })
})
.listen(8000)