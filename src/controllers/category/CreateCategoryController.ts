import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { CreateCategoryService } from '../../services/category/CreateCategoryService'
import { AppError } from '../../errors/AppError'

class CreateCategoryController {
  async handle(req: Request, res: Response) {
    const { name } = req.body

    if (!name) {
      throw new AppError(
        'O nome da categoria é obrigatório.',
        StatusCodes.BAD_REQUEST
      )
    }

    const service = new CreateCategoryService()

    try {
      const result = await service.execute({ name })
      return res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro ao criar categoria.' })
    }
  }
}

export { CreateCategoryController }
