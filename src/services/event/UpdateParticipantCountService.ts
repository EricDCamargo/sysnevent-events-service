import { StatusCodes } from 'http-status-codes'
import prismaClient from '../../prisma'
import { AppError } from '../../errors/AppError'

interface UpdateParticipantCountRequest {
  eventId: string
  action: 'increment' | 'decrement'
}

class UpdateParticipantCountService {
  async execute({
    eventId,
    action
  }: UpdateParticipantCountRequest): Promise<void> {
    const event = await prismaClient.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      throw new AppError('Evento não encontrado', StatusCodes.NOT_FOUND)
    }

    if (action === 'decrement' && event.currentParticipants === 0) {
      throw new AppError(
        'currentParticipants já está em zero',
        StatusCodes.BAD_REQUEST
      )
    }

    await prismaClient.event.update({
      where: { id: eventId },
      data: {
        currentParticipants: {
          [action]: 1
        }
      }
    })
  }
}

export { UpdateParticipantCountService }
