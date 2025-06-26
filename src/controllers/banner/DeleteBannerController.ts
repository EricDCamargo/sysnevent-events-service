import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { DeleteBannerService } from '../../services/banner/DeleteBannerService'

export class DeleteBannerController {
  async handle(req: Request, res: Response) {
    try {
      const id = req.query.id as string

      if (!id) {
        throw new AppError(
          'ID do banner é obrigatório.',
          StatusCodes.BAD_REQUEST
        )
      }

      const service = new DeleteBannerService()
      const result = await service.execute(id)

      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao deletar banner.' })
    }
  }
}
