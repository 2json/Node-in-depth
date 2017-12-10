const fs = require('fs')
const stream = fs.createReadStream('a-error')

stream.on('error', (error) => {
    console.trace()
    console.error('Stack: ', error.stack)
    console.error('The error raised was:', error)
})