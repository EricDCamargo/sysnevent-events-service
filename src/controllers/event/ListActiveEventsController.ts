import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { ListActiveEventsService } from '../../services/event/ListActiveEventsService'

class ListActiveEventsController {
  async handle(req: Request, res: Response) {
    const listEventsService = new ListActiveEventsService()

    try {
      const result = await listEventsService.execute()
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao listar eventos' })
    }
  }
}

export { ListActiveEventsController }
