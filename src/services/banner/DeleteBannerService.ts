import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

export class DeleteBannerService {
  async execute(id: string): Promise<{ message: string }> {
    const banner = await prismaClient.banner.findUnique({ where: { id } })

    if (!banner) {
      throw new AppError('Banner não encontrado.', StatusCodes.NOT_FOUND)
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

    return { message: 'Banner deletado com sucesso.' }
  }
}
