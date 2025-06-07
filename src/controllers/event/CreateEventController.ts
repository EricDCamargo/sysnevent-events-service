// src/controllers/event/CreateEventController.ts
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { CreateEventService } from '../../services/event/CreateEventService'

class CreateEventController {
  async handle(req: Request, res: Response) {
    const {
      name,
      category,
      course,
      semester,
      maxParticipants,
      location,
      customLocation,
      speakerName,
      startDate,
      startTime,
      endTime,
      description
    } = req.body

    const createEventService = new CreateEventService()

    try {
      const result = await createEventService.execute({
        name,
        category,
        course,
        semester,
        maxParticipants,
        location,
        customLocation,
        speakerName,
        startDate,
        startTime,
        endTime,
        description
      })

      return res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao criar evento' })
    }
  }
}

export { CreateEventController }
