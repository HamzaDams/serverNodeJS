import http from 'node:http'

const PORT = process.env.PORT || 3000

const server = http.createServer((req, res) => {
    res.end('Hello world')
}).listen(PORT, () => console.log(`Server is running at ${PORT}`))

export {
    server
}