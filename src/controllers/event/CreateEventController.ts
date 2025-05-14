import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { CreateEventService } from '../../services/event/CreateEventService'

class CreateEventController {
  async handle(req: Request, res: Response) {
    const { name, description, date, location, capacity } = req.body
    const ownerId = req.user_id // Esse dado é injetado pelo middleware JWT

    const createEventService = new CreateEventService()

    try {
      const result = await createEventService.execute({
        name,
        description,
        date,
        location,
        capacity,
        ownerId
      })

      return res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
      console.error('Erro ao criar evento:', error)
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Erro interno ao criar evento'
      })
    }
  }
}

export { CreateEventController }
