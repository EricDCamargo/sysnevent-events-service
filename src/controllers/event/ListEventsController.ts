import { Request, Response } from 'express'
import { ListEventsService } from '../../services/event/ListEventsService'
import { StatusCodes } from 'http-status-codes'
import { Category } from '@prisma/client'

class ListEventsController {
  async handle(req: Request, res: Response) {
    const { category, startDate, endDate } = req.query

    const filters = {
      category: category as Category,
      startDate: startDate as string,
      endDate: endDate as string
    }

    const service = new ListEventsService()
    const events = await service.execute(filters)

    return res.status(StatusCodes.OK).json(events)
  }
}

export { ListEventsController }
