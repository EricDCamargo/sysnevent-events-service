import prismaClient from '../../prisma'
import { AppError } from '../../errors/AppError'
import { AppResponse } from '../../@types/app.types'
import { StatusCodes } from 'http-status-codes'

interface DeleteEventRequest {
  event_id: string
}

class DeleteEventService {
  async execute({ event_id }: DeleteEventRequest): Promise<AppResponse> {
    const event = await prismaClient.event.findUnique({
      where: { id: event_id }
    })

    if (!event) {
      throw new AppError('Evento não encontrado!', StatusCodes.NOT_FOUND)
    }

    await prismaClient.event.delete({
      where: { id: event_id }
    })

    return {
      message: 'Evento excluído com sucesso!'
    }
  }
}

export { DeleteEventService }
