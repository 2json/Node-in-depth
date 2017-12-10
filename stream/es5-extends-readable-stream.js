const util = require('util')
const { Readable } = require('stream')
const fs = require('fs')

function JSONLineReader(source) {
    Readable.call(this)
    this._source = source
    this._foundLineEnd = false
    this._buffer = ''

    source.on('readable', () => {
        this.read()
    })
}

// inherits
util.inherits(JSONLineReader, Readable)

JSONLineReader.prototype._read = function(size) {
    let chunk
    let line
    let lineIndex
    let result

    function parseJSON(line) {
        if(line) {
            result = JSON.parse(line)
            this.emit('object', result)
            this.push(util.inspect(result))
        }else {
            this.push(' ')
        }
    }

    if(this._buffer.length === 0) {
        chunk = this._source.read()
        this._buffer += chunk
    }

    lineIndex = this._buffer.indexOf('\n')
    if(lineIndex === -1) {
        line = this._buffer.slice(0)
        if(line) {
            parseJSON.bind(this)(line)
            // end read
            this.push(null)
            this._buffer = ""
        }
    }else {
        line = this._buffer.slice(0, lineIndex)
        this._buffer = this._buffer.slice(lineIndex + 1)
        parseJSON.bind(this)(line)
    }
}

const input = fs.createReadStream(__dirname + '/json-lines.txt', {
    encoding: 'utf8'
})

const jsonLineReader = new JSONLineReader(input)

jsonLineReader.on('object', (result) => {
    console.log('Got Result\n')
    console.log(result)
})