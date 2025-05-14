import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { ListMyEventsService } from '../../services/event/ListMyEventsService'

class ListMyEventsController {
  async handle(req: Request, res: Response) {
    const user_id = req.user_id

    const listMyEventsService = new ListMyEventsService()

    try {
      const result = await listMyEventsService.execute({ user_id })
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao listar eventos do usuário' })
    }
  }
}

export { ListMyEventsController }
