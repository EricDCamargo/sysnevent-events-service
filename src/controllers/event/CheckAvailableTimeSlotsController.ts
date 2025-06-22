import { Request, Response } from 'express'
import { CheckAvailableTimeSlotsService } from '../../services/event/CheckAvailableTimeSlotsService'
import { StatusCodes } from 'http-status-codes'
import { Location } from '@prisma/client'

class CheckAvailableTimeSlotsController {
  async handle(req: Request, res: Response) {
    const { location, date, ignoreEventId } = req.query

    if (
      !location ||
      typeof location !== 'string' ||
      !date ||
      typeof date !== 'string'
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Location and date are required' })
    }

    const upperLocation = location.toUpperCase() as keyof typeof Location
    if (!(upperLocation in Location)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Invalid location' })
    }

    const service = new CheckAvailableTimeSlotsService()
    const result = await service.execute(Location[upperLocation], date, ignoreEventId as string)

    return res.json(result)
  }
}

export { CheckAvailableTimeSlotsController }
