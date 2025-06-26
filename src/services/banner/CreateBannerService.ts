import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

interface CreateBannerRequest {
  name: string
  imageUrl: string
  order?: number
}

export class CreateBannerService {
  async execute({
    name,
    imageUrl,
    order
  }: CreateBannerRequest): Promise<AppResponse> {
    let finalOrder: number

    // Caso o valor esteja indefinido ou nulo ou não numérico
    if (order == null || isNaN(order)) {
      // Insere no topo da fila: ordem 1
      finalOrder = 1
    } else if (order < 1) {
      throw new AppError('A ordem do baner deve ser maior ou igual a 1.')
    } else {
      finalOrder = order
    }

    // Empurra os banners que têm ordem igual ou maior
    await prismaClient.banner.updateMany({
      where: {
        order: {
          gte: finalOrder
        }
      },
      data: {
        order: {
          increment: 1
        }
      }
    })

    const banner = await prismaClient.banner.create({
      data: {
        name,
        imageUrl,
        order: finalOrder
      }
    })

    return { data: banner, message: 'Baner criado com sucesso.' }
  }
}
