import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ListCategoriesService } from '../../services/category/ListCategoriesService'
import { AppError } from '../../errors/AppError'

class ListCategoriesController {
  async handle(req: Request, res: Response) {
    const service = new ListCategoriesService()

    try {
      const result = await service.execute()
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro ao listar categorias.' })
    }
  }
}

export { ListCategoriesController }
