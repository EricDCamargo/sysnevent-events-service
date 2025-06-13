import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { UpdateEventService } from '../../services/event/UpdateEventService'

class UpdateEventController {
  async handle(req: Request, res: Response) {
    const event_id = req.query.event_id as string

    if (!event_id) {
      throw new AppError(
        'É necessario informar o ID do evento',
        StatusCodes.BAD_REQUEST
      )
    }

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
      description,
      isRestricted
    } = req.body

    const updateEventService = new UpdateEventService()

    try {
      const result = await updateEventService.execute({
        event_id,
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
        description,
        isRestricted
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
