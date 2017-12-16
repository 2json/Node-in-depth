const cp = require('child_process')

cp.execFile('echo', ['hello', 'world'], (error, stdout, stderr) => {
    if(error) {
        return console.error(error)
    }
    console.log(`stdout ${stdout}`)
    console.log(`stderr ${stderr}`)
})