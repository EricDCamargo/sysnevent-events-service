import prismaClient from '../../prisma'
import { AppResponse } from '../../@types/app.types'

export class ListAllBannersService {
  async execute(): Promise<AppResponse> {
    const banners = await prismaClient.banner.findMany({
      orderBy: { order: 'asc' }
    })

    const orderOptions = Array.from({ length: banners.length + 1 }, (_, i) => i + 1)

    return {
      data: {
        banners,
        orderOptions
      },
      message: 'Banners listados com sucesso.'
    }
  }
}
