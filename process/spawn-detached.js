const cp = require('child_process')

cp.spawn('./run.sh', [], {
    detached: true
})