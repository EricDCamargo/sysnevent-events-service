import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { UpdateParticipantCountService } from '../../services/event/UpdateParticipantCountService'
import { AppError } from '../../errors/AppError'

export class UpdateParticipantCountController {
  async handle(req: Request, res: Response) {
    const { eventId, action } = req.body

    if (!eventId || !['increment', 'decrement'].includes(action)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error:
          'Required fields: eventId and action ("increment" or "decrement")'
      })
    }
    const service = new UpdateParticipantCountService()
    try {
      await service.execute({ eventId, action })

      return res.status(StatusCodes.OK).json({
        message: `currentParticipants ${action}ed com sucesso`
      })
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Erro ao atualizar currentParticipants'
      })
    }
  }
}
