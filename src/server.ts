import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import 'express-async-errors'
import { router } from './routes'
import fileUpload from 'express-fileupload'

const app = express()

//Default middlewares
app.use(express.json())
app.use(cors())

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
  })
)

// app.use((req, res, next) => {
//   console.log('\n--- [MICROSERVIÇO Eventos] Requisição recebida ---')
//   console.log(`[METHOD] ${req.method}`)
//   console.log(`[URL] ${req.url}`) // <- importante
//   console.log(`[ORIGINAL URL] ${req.originalUrl}`) // <- também ajuda
//   console.log('[HEADERS]', req.headers)
//   console.log('[BODY]', req.body)
//   console.log('--------------------------------------------------\n')
//   next()
// })

app.use(router)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: err.message
    })
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    messege: 'Internal server error'
  })
})

app.listen(process.env.PORT, () =>
  console.log('Server online na porta', process.env.PORT)
)
