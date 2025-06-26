import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ListAllBannersService } from '../../services/banner/ListAllBannersService'
import { AppError } from '../../errors/AppError'

export class ListAllBannersController {
  async handle(req: Request, res: Response) {
    const service = new ListAllBannersService()

    try {
      const result = await service.execute()
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao listar baners.' })
    }
  }
}
