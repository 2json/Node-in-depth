const express = require('express')
const util = require('util')
const stream = require('stream')
const app = express()

const StatStream = function(limit) {
    stream.Readable.call(this)
    this.limit = limit
}

util.inherits(StatStream, stream.Readable)

/**
 * If you want to write a readable stream, _read is necessary
 */

 StatStream.prototype._read = function(size) {
     if(this.limit === 0) {
        // cancel readable stream 
        this.push(null)
     }else {
         this.push(util.inspect(process.memoryUsage()))
         this.push('<br />')
         this.limit--
     }
 }

 app.get('/', (req, res) => {
     let statStream = new StatStream(10)
     res.writeHead(200, {
         'Content-Type': 'text/html'
     })
     statStream.pipe(res)
 })

 app.listen(3000)