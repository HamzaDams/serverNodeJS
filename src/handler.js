import path from 'node:path'
import { parse } from 'node:url'
import { DEFAULT_HEADER } from './utils/utils.js'


const allRoutes = {
    '/heroes:get': async (req, res) => {
        res.write('GET')
        res.end()
    },
    //404 Routes
    default: (req, res) => {
        res.writeHead(404, DEFAULT_HEADER)
        res.write('Not found error')
        res.end()
    }
}

function handler(req, res) {
    const {
        url,
        method
    } = req

    const { pathname } = parse(url, true)

    const key = `${pathname}:${method.toLowerCase()}`
    const chosen = allRoutes[key] || allRoutes.default

    return Promise.resolve(chosen(req, res)).catch(handlerError(res))
}

function handlerError(res) {
    return error => {
        console.log('Something bad has happened', error.stack)
        res.writeHead(500, DEFAULT_HEADER)
        res.write(JSON.stringify({
            error: 'Internal server error'
        }))

        return res.end()
    }
}

export default handler