import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { DeleteEventService } from '../../services/event/DeleteEventService'
import { AppError } from '../../errors/AppError'

class DeleteEventController {
  async handle(req: Request, res: Response) {
    const event_id = req.params.id
    const user_id = req.user_id

    const deleteEventService = new DeleteEventService()

    try {
      const result = await deleteEventService.execute({ event_id, user_id })
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao excluir evento' })
    }
  }
}

export { DeleteEventController }
