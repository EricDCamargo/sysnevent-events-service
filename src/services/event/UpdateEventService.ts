import prismaClient from '../../prisma'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'

interface UpdateEventRequest {
  event_id: string
  user_id: string
  name?: string
  description?: string
  date?: string
  location?: string
  capacity?: number
}

class UpdateEventService {
  async execute({
    event_id,
    user_id,
    name,
    description,
    date,
    location,
    capacity
  }: UpdateEventRequest): Promise<AppResponse> {
    const event = await prismaClient.event.findUnique({
      where: { id: event_id }
    })

    if (!event) {
      throw new AppError('Evento não encontrado!', StatusCodes.NOT_FOUND)
    }

    if (event.ownerId !== user_id) {
      throw new AppError(
        'Ação não permitida! Você não é o dono deste evento.',
        StatusCodes.FORBIDDEN
      )
    }

    const updatedEvent = await prismaClient.event.update({
      where: { id: event_id },
      data: {
        name: name ?? event.name,
        description: description ?? event.description,
        date: date ? new Date(date) : event.date,
        location: location ?? event.location,
        capacity: capacity ?? event.capacity
      },
      select: {
        id: true,
        name: true,
        description: true,
        date: true,
        location: true,
        capacity: true,
        status: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return {
      data: updatedEvent,
      message: 'Evento atualizado com sucesso!'
    }
  }
}

export { UpdateEventService }
