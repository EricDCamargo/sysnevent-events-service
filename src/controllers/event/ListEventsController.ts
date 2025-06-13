import { Request, Response } from 'express'
import { ListEventsService } from '../../services/event/ListEventsService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class ListEventsController {
  async handle(req: Request, res: Response) {
    const { categoryId, startDate, endDate } = req.query

    const filters = {
      categoryId: categoryId as string,
      startDate: startDate as string,
      endDate: endDate as string
    }
    const lsitEventsService = new ListEventsService()
    try {
      const events = await lsitEventsService.execute(filters)
      return res.status(StatusCodes.OK).json(events)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao buscar detalhes do evento' })
    }
  }
}

export { ListEventsController }
