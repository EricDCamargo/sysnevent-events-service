import prismaClient from '../../prisma'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { FIXED_CATEGORIES } from '../../@types/types'
import { AppResponse } from '../../@types/app.types'

interface DeleteCategoryRequest {
  id: string
}

class DeleteCategoryService {
  async execute({ id }: DeleteCategoryRequest): Promise<AppResponse> {
    const category = await prismaClient.category.findUnique({ where: { id } })

    if (!category) {
      throw new AppError('Categoria não encontrada.', StatusCodes.NOT_FOUND)
    }

    if (category.name === FIXED_CATEGORIES.CURSO_ONLINE.name) {
      throw new AppError(
        `Categoria ${FIXED_CATEGORIES.CURSO_ONLINE.name} não pode ser excluida.`,
        StatusCodes.FORBIDDEN
      )
    }

    await prismaClient.category.delete({ where: { id } })

    return {
      message: 'Categoria excluída com sucesso.'
    }
  }
}

export { DeleteCategoryService }
