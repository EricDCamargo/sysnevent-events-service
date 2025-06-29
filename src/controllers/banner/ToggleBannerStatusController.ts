import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ToggleBannerStatusService } from '../../services/banner/ToggleBannerStatusService'
import { AppError } from '../../errors/AppError'

export class ToggleBannerStatusController {
  async handle(req: Request, res: Response) {
    const { bannerId } = req.body

    if (!bannerId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Necessario fornecer o ID do Baner'
      })
    }

    const service = new ToggleBannerStatusService()

    try {
      const result = await service.execute({ bannerId })

      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      console.error(error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Erro interno ao atualizar status do banner.'
      })
    }
  }
}
