import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { GetEventDetailsService } from '../../services/event/GetEventDetailsService'

class GetEventDetailsController {
  async handle(req: Request, res: Response) {
    const event_id = req.query.event_id as string

    const getEventDetailsService = new GetEventDetailsService()

    try {
      const result = await getEventDetailsService.execute({ event_id })
      return res.status(StatusCodes.OK).json(result)
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

export { GetEventDetailsController }
