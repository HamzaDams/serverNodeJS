import {
    join,
    dirname
} from 'node:path'

import { parse, fileURLToPath } from 'node:url'
import { generateInstance } from './factories/heroFactory.js'
import { routes } from './routes/heroRoute.js'
import { DEFAULT_HEADER } from './utils/utils.js'

const currentDir = dirname(
    fileURLToPath(
        import.meta.url
    )
)

const filePath = join(currentDir, './database', 'data.json')

const heroService = generateInstance({
    filePath
})

const heroRoutes = routes({
    heroService
})

const allRoutes = {
    ...heroRoutes,
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