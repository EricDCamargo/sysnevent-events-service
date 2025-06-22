import { Request, Response } from 'express'
import { CheckUnavailableDatesService } from '../../services/event/CheckUnavailableDatesService'
import { StatusCodes } from 'http-status-codes'
import { Location } from '@prisma/client'

class CheckUnavailableDatesController {
  async handle(req: Request, res: Response) {
    const { location, ignoreEventId } = req.query

    if (!location || typeof location !== 'string') {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Localização não informada ou inválida' })
    }
    const upperLocation = location.toUpperCase() as keyof typeof Location

    if (!(upperLocation in Location)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Localização inválida' })
    }

    const service = new CheckUnavailableDatesService()
    const result = await service.execute(
      Location[upperLocation],
      ignoreEventId as string
    )

    return res.json(result)
  }
}

export { CheckUnavailableDatesController }
