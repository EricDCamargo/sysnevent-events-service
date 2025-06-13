import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'
import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'

interface CreateCategoryRequest {
  name: string
}

class CreateCategoryService {
  async execute({ name }: CreateCategoryRequest): Promise<AppResponse> {
    const exists = await prismaClient.category.findUnique({
      where: { name }
    })

    if (exists) {
      throw new AppError(
        'Categoria já existe com esse nome.',
        StatusCodes.CONFLICT
      )
    }

    const category = await prismaClient.category.create({
      data: { name }
    })

    return {
      data: category,
      message: 'Categoria criada com sucesso.'
    }
  }
}

export { CreateCategoryService }
