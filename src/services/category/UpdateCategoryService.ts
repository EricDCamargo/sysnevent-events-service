import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'
import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { FIXED_CATEGORIES } from '../../@types/types'

interface UpdateCategoryRequest {
  id: string
  name: string
}

class UpdateCategoryService {
  async execute({ id, name }: UpdateCategoryRequest): Promise<AppResponse> {
    const category = await prismaClient.category.findUnique({ where: { id } })
    if (!category) {
      throw new AppError('Categoria não encontrada.', StatusCodes.NOT_FOUND)
    }

    if (category.name === FIXED_CATEGORIES.CURSO_ONLINE.name) {
      throw new AppError(
        `Categoria ${FIXED_CATEGORIES.CURSO_ONLINE.name} não pode ser editada.`,
        StatusCodes.FORBIDDEN
      )
    }

    const duplicate = await prismaClient.category.findFirst({
      where: { name, NOT: { id } }
    })

    if (duplicate) {
      throw new AppError(
        'Já existe outra categoria com esse nome.',
        StatusCodes.CONFLICT
      )
    }

    const updated = await prismaClient.category.update({
      where: { id },
      data: { name }
    })

    return {
      data: updated,
      message: 'Categoria atualizada com sucesso.'
    }
  }
}

export { UpdateCategoryService }
