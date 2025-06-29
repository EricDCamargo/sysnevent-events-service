import { StatusCodes } from 'http-status-codes'
import prismaClient from '../../prisma'
import { AppError } from '../../errors/AppError'
import { AppResponse } from '../../@types/app.types'

interface ToggleBannerStatusRequest {
  bannerId: string
}

class ToggleBannerStatusService {
  async execute({ bannerId }: ToggleBannerStatusRequest): Promise<AppResponse> {
    const banner = await prismaClient.banner.findUnique({
      where: { id: bannerId }
    })

    if (!banner) {
      throw new AppError('Banner não encontrado', StatusCodes.NOT_FOUND)
    }

    const updatedBanner = await prismaClient.banner.update({
      where: { id: bannerId },
      data: {
        isActive: !banner.isActive
      }
    })
    return {
      message: updatedBanner.isActive
        ? 'Baner ativado com sucesso!'
        : 'Baner desativado com sucesso!'
    }
  }
}

export { ToggleBannerStatusService }
