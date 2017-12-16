const cp = require('child_process')

cp.exec('cat ./test.txt | sort | uniq', (error, stdout, stderr) => {
    if(error) {
        return console.error(error)
    }
    console.log(stdout)
})