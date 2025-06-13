import { Request, Response } from 'express'
import { DeleteCategoryService } from '../../services/category/DeleteCategoryService'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'

class DeleteCategoryController {
  async handle(req: Request, res: Response) {
    const id = req.query.id as string

    if (!id) {
      throw new AppError(
        'ID da categoria é obrigatório.',
        StatusCodes.BAD_REQUEST
      )
    }

    const service = new DeleteCategoryService()

    try {
      const result = await service.execute({ id })
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao excluir categoria.' })
    }
  }
}

export { DeleteCategoryController }
