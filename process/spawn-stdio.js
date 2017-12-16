const fs = require('fs')
const cp = require('child_process')

const logout = fs.openSync('./logout.out', 'a')
const logerr = fs.openSync('./logout.err', 'a')

const child = cp.spawn('./run.sh', [], {
    detached: true,
    stdio: ['ignore', logout, logerr]
})