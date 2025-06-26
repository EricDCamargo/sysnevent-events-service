import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'
import { AppResponse } from '../../@types/app.types'

export class DeleteBannerService {
  async execute(id: string): Promise<AppResponse> {
    const banner = await prismaClient.banner.findUnique({ where: { id } })

    if (!banner) {
      throw new AppError('Baner não encontrado.', StatusCodes.NOT_FOUND)
    }

    // Deleta o banner
    await prismaClient.banner.delete({ where: { id } })

    // Reorganiza as ordens dos banners que estavam depois do deletado
    await prismaClient.banner.updateMany({
      where: {
        order: {
          gt: banner.order
        }
      },
      data: {
        order: {
          decrement: 1
        }
      }
    })

    return { message: 'Baner deletado com sucesso.' }
  }
}
