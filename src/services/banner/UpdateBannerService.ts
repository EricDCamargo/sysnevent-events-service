import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'
import { Banner } from '@prisma/client'

interface UpdateBannerRequest {
  id: string
  name?: string
  imageUrl?: string
  order?: number
  isActive?: boolean
}

export class UpdateBannerService {
  async execute({
    id,
    name,
    imageUrl,
    order,
    isActive
  }: UpdateBannerRequest): Promise<{ data: Banner; message: string }> {
    const banner = await prismaClient.banner.findUnique({ where: { id } })

    if (!banner) {
      throw new AppError('Banner não encontrado.', StatusCodes.BAD_REQUEST)
    }

    const updates: Partial<Banner> = {}

    if (name) updates.name = name
    if (typeof imageUrl === 'string') updates.imageUrl = imageUrl
    if (typeof isActive === 'boolean') updates.isActive = isActive

    if (order !== undefined && order !== null && order !== banner.order) {
      if (order < 1) {
        throw new AppError(
          'A ordem do banner deve ser maior ou igual a 1.',
          StatusCodes.BAD_REQUEST
        )
      }

      const totalBanners = await prismaClient.banner.count()

      if (order > totalBanners) {
        throw new AppError(
          `A ordem máxima permitida atualmente é ${totalBanners}.`,
          StatusCodes.BAD_REQUEST
        )
      }

      // Ajuste das ordens: libera a posição antiga, empurra quem está entre a nova e antiga
      if (order < banner.order) {
        // Está subindo na lista → banners entre a nova e a antiga ordem descem
        await prismaClient.banner.updateMany({
          where: {
            order: {
              gte: order,
              lt: banner.order
            },
            id: {
              not: banner.id
            }
          },
          data: {
            order: {
              increment: 1
            }
          }
        })
      } else {
        // Está descendo na lista → banners entre a antiga e nova ordem sobem
        await prismaClient.banner.updateMany({
          where: {
            order: {
              gt: banner.order,
              lte: order
            },
            id: {
              not: banner.id
            }
          },
          data: {
            order: {
              decrement: 1
            }
          }
        })
      }

      updates.order = order
    }

    const updated = await prismaClient.banner.update({
      where: { id },
      data: updates
    })

    return {
      data: updated,
      message: 'Banner atualizado com sucesso.'
    }
  }
}
