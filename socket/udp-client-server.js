const assert = require('assert')
const dgram = require('dgram')
const fs = require('fs')
// 默认读取的字符串的长度
const defaultSize = 16
// 服务器的端口号
const port = 41234

// 创建客户端
function Client(remoteIp) {
    // 创建客户端的socket
    const socket = dgram.createSocket('udp4')
    // 引入readline模块
    const readline = require('readline')
    // 创建readline接口
    const rl = readline.createInterface(
        process.stdin,
        process.stdout
    )

    // 向服务器发送数据的函数
    function sendData(message) {
        socket.send(new Buffer(message), 0, message.length, port, remoteIp, (err, bytes) => {
            if(err) {
                return console.error(err)
            }
            console.log(`Sent: ${message}`)
            rl.prompt()
        })
    }
 
    // 向服务器发送加入的数据
    socket.send(new Buffer('<JOIN>'), 0, 6, port, remoteIp)
    // 设置客户端的提示符号
    rl.setPrompt('Message> ')
    rl.prompt()

    // 监听rl的line事件，获取数据
    rl.on('line', (line) => {
        sendData(line)
    }).on('close', () => {
        process.exit(0)
    })

    // 监听message事件，获取服务器向客户端发送的数据
    socket.on('message', (msg, info) => {
        console.log(`\n<${info.address}> ${msg.toString()}`)
        rl.prompt()
    })
}

// 创建服务器
function Server() {
    // 保存客户端的数组
    const clients = []
    // 创建一个udp服务器
    const server = dgram.createSocket('udp4')

    // 监听message事件，获取客户端发送过来的数据
    server.on('message', (msg, info) => {
        // 获取客户端的端口号和ip地址
        const clientId = `${info['address']}:${info['port']}`
        // 转化buffer －>string
        msg = msg.toString()
        // 先判断是不是已经接受过这个客户端的信息
        if(!clients[clientId]) {
            clients[clientId] = info
        }
        console.log(clients)
        // 先判断提示信息
        if(msg.match(/^</)) {
            return console.log(`Control message: ${msg}`)
        }

        // 向除了自己之外的其他客户端发送信息
        for(let client in clients) {
            // console.log(client)
            if(client !== clientId) {
                // 获取对应的客户端的信息
                client = clients[client]
                // console.log(client)
                server.send(
                    new Buffer(msg),
                    0,
                    msg.length,
                    client.port,
                    client.address,
                    (err, bytes) => {
                        if(err) {
                            console.error(err)
                            console.log(`Bytes sent: ${bytes}`)
                        }
                    }
                )
            }
        }
    })

    // 监听listening事件
    server.on('listening', () => {
        const address = server.address()
        console.log(`Server ready: ${address['address']}:${address['port']}`)
    })

    // 绑定对应的端口
    server.bind(port)
}

module.exports = {
    Client,
    Server
}

if(!module.parent) {
    if(process.argv[2] === 'client') {
        new Client(process.argv[3])
    }else if(process.argv[2] === 'server'){
        new Server()
    }else {
        console.error('Unknown option')
    }
}