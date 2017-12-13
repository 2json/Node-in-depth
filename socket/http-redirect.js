const http = require('http')
const https = require('https')
const url = require('url')

class Request {
    constructor(maxRedirects = 10) {
        // 控制最大的重定向的次数
        this.maxRedirects = maxRedirects
        // 控制已经重定向的次数
        this.redirected = 0
        // error
        this.error = null
    }

    get(href, callback) {
        this.href = href
        const uri = url.parse(href)
        const options = {
            host: uri.host,
            path: uri.path
        }
        const httpGet = uri.protocol === 'http' ? http.get : https.get

        console.log(`Requesting href: ${href}`)

        // 发送请求
        httpGet(
            options,
            (response) => {
                this._processResponse(response, options, callback)
            }
        ).on(
            'error',
            (error) => {
                callback(error || null)
            }
        )
        
    }
    _processResponse(response, options, callback) {
        if(response.statusCode >= 300 && response.statusCode < 400) {
            if(this.redirected >= this.maxRedirects) {
                this.error = new Error(`Too many refirects for: ${href}`)
            }else {
                this.redirected++
                // response.headers.location重定向的时候是不带域名的
                this.href = url.resolve(options.host, response.headers.location)
                return this.get(this.href, callback)
            }
        }

        response.url = this.href
        response.redirected = this.redirected

        console.log(`Redirected: ${this.href}`)

        response.on('data', (data) => {
            console.log(`Got data. length: ${data.length}`)
        })

        response.on('end', () => {
            this._end(response, callback)
        })
    }

    _end(response, callback) {
        console.log('Connection ended')
        callback(this.error, response)
    }
}

// new an object
const request = new Request()
request.get(
    'http://www.baidu.com/',
    (error, response) => {
        if(error) {
            console.error(error)
        }else{
            console.log(response.url, response.redirected)
            process.exit()
        }
    }
)