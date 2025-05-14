import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

interface CreateEventRequest {
  name: string
  description?: string
  date: string
  location: string
  capacity: number
  ownerId: string
}

class CreateEventService {
  async execute({
    name,
    description,
    date,
    location,
    capacity,
    ownerId
  }: CreateEventRequest) {
    if (new Date(date) < new Date()) {
      throw new AppError(
        'A data do evento não pode estar no passado',
        StatusCodes.BAD_REQUEST
      )
    }

    if (capacity <= 0) {
      throw new AppError(
        'A capacidade deve ser maior que zero',
        StatusCodes.BAD_REQUEST
      )
    }

    const event = await prismaClient.event.create({
      data: {
        name,
        description,
        date: new Date(date),
        location,
        capacity,
        ownerId
      }
    })

    return {
      data: event,
      message: 'Evento criado com sucesso!'
    }
  }
}

export { CreateEventService }
