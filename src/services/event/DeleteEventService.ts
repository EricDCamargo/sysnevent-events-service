import prismaClient from '../../prisma'
import { AppError } from '../../errors/AppError'
import { AppResponse } from '../../@types/app.types'
import { StatusCodes } from 'http-status-codes'

interface DeleteEventRequest {
  event_id: string
  user_id: string
}

class DeleteEventService {
  async execute({
    event_id,
    user_id
  }: DeleteEventRequest): Promise<AppResponse> {
    const event = await prismaClient.event.findUnique({
      where: { id: event_id }
    })

    if (!event) {
      throw new AppError('Evento não encontrado!', StatusCodes.NOT_FOUND)
    }

    if (event.ownerId !== user_id) {
      throw new AppError(
        'Você não tem permissão para excluir este evento.',
        StatusCodes.FORBIDDEN
      )
    }

    if (!event.status) {
      throw new AppError('Evento já está desativado.', StatusCodes.BAD_REQUEST)
    }

    await prismaClient.event.update({
      where: { id: event_id },
      data: { status: false }
    })

    return {
      data: null,
      message: 'Evento excluído (inativado) com sucesso!'
    }
  }
}

export { DeleteEventService }
