import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import {
  earlyPhaseMiddleWare,
  latePhaseMiddleware,
  latePhaseMiddlewareWithError
} from '../lib/expressCommon.js'
import ExpressRouter from '../routes/ExpressRouter.js'
import cookieParser from 'cookie-parser'
import { logger } from '../lib/logger.js'
import { fileURLToPath } from 'url'
import path from 'path'

const subProcess = 'httpServer'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const expressServer = express()
const httpServer = createServer(expressServer)

expressServer.use('/images', express.static(path.join(__dirname, '..', 'images')))
expressServer.use(
  '/static',
  express.static(path.join(__dirname, '..', 'var', 'data', 'static'))
)

expressServer.use(cookieParser())
expressServer.use(cors({ credentials: true, origin: true }))
expressServer.use(bodyParser.json({ limit: '100mb' }))

expressServer.use(earlyPhaseMiddleWare)

expressServer.get('/', function (req, res) {
  res.send({ msg: `Welcome to ${process.env.SERVICE_ID} API root !` })
})

expressServer.use('/', ExpressRouter)
expressServer.set('trust proxy', true)

expressServer.use(latePhaseMiddleware)
expressServer.use(latePhaseMiddlewareWithError)

httpServer.listen(process.env.EXPRESS_PORT, () => {
  logger.info({
    subProcess,
    msg: 'Http server is listening on port ' + process.env.EXPRESS_PORT
  })
})

export { expressServer, httpServer }
