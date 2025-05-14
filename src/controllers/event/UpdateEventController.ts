import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { AppError } from '../../errors/AppError'
import { UpdateEventService } from '../../services/event/UpdateEventService'

class UpdateEventController {
  async handle(req: Request, res: Response) {
    const event_id = req.query.event_id as string
    const { name, description, date, location, capacity } = req.body

    const user_id = req.user_id

    if (!user_id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Usuário não autenticado' })
    }

    const updateEventService = new UpdateEventService()

    try {
      const result = await updateEventService.execute({
        event_id,
        user_id,
        name,
        description,
        date,
        location,
        capacity
      })

      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao atualizar evento' })
    }
  }
}

export { UpdateEventController }
