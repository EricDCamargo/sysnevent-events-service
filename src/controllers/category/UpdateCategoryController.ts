import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { UpdateCategoryService } from '../../services/category/UpdateCategoryService'
import { AppError } from '../../errors/AppError'

class UpdateCategoryController {
  async handle(req: Request, res: Response) {
    const id = req.query.id as string
    const { name } = req.body

    if (!id || !name) {
      throw new AppError(
        'ID e novo nome da categoria são obrigatórios.',
        StatusCodes.BAD_REQUEST
      )
    }

    const service = new UpdateCategoryService()

    try {
      const result = await service.execute({ id, name })
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro ao atualizar categoria.' })
    }
  }
}

export { UpdateCategoryController }
