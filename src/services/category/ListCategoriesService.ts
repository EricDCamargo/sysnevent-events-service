import prismaClient from '../../prisma'
import { AppResponse } from '../../@types/app.types'

class ListCategoriesService {
  async execute(): Promise<AppResponse> {
    const categories = await prismaClient.category.findMany({
      orderBy: { name: 'asc' }
    })

    return {
      data: categories,
      message: 'Categorias listadas com sucesso.'
    }
  }
}

export { ListCategoriesService }
