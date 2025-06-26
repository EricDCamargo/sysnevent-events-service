import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ListActiveBannersService } from '../../services/banner/ListActiveBannersService'
import { AppError } from '../../errors/AppError'

export class ListActiveBannersController {
  async handle(_req: Request, res: Response) {
    const service = new ListActiveBannersService()

    try {
      const result = await service.execute()
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao listar banners ativos.' })
    }
  }
}
