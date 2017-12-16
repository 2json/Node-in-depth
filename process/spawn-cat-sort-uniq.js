const cp = require('child_process')
const cat = cp.spawn('cat', ['./test.txt'])
const sort = cp.spawn('sort')
const uniq = cp.spawn('uniq')

cat.stdout.pipe(sort.stdin)
sort.stdout.pipe(uniq.stdin)
uniq.stdout.pipe(process.stdout)