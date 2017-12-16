import { setImmediate } from 'timers';

const cp = require('child_process')
const cpus = require('os').cpus().length

module.exports = (workModule) => {
    let poolSize = 0
    const awaiting = []
    const readyPool = []

    return function doWork(job, cb){
        if(!readyPool.length && poolSize > cpus) {
            return awaiting.push([doWork, job, cb])
        }

        const child = readyPool.length ? readyPool.shift() : (poolSize++, cp.fork(workModule))
        let cbTriggeres = false

        child
            .removeAllListeners()
            .once('error', (error) => {
                if(!cbTriggeres){
                    cb(error)
                    cbTriggeres = true
                }
                child.kill()
            })
            .once('exit', () => {
                if(!cbTriggeres) {
                    cb(new Error(`Child exited with code ${code}`))
                    poolSize--

                    const childIndex = readyPool.indexOf(child)
                    if(childIndex > -1) {
                        readyPool.splice(childIndex, 1)
                    }
                }
            })
            .once('message', (message) => {
                cb(null, message)
                cbTriggeres = true
                readyPool.push(child)
                if(awaiting.length) {
                    setImmediate.apply(null, awaiting.shift)
                }
            })
            .send(job)
    }
}