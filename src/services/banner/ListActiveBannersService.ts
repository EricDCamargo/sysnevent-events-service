import prismaClient from '../../prisma'
import { AppResponse } from '../../@types/app.types'

export class ListActiveBannersService {
  async execute(): Promise<AppResponse> {
    const banners = await prismaClient.banner.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      }
    })

    return {
      data: banners,
      message: 'Baner ativos listados com sucesso.'
    }
  }
}
