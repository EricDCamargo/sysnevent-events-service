import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'
import { Category, Course, Semester, Location } from '@prisma/client'
import { AppResponse } from '../../@types/app.types'
interface CreateEventRequest {
  name: string
  category: Category
  course: Course
  semester?: Semester
  maxParticipants: number
  location: Location
  customLocation?: string
  speakerName: string
  startDate: Date
  startTime: Date
  endTime: Date
  description: string
  isRestricted?: boolean
}

class CreateEventService {
  async execute({
    name,
    category,
    course,
    semester,
    maxParticipants,
    location,
    customLocation,
    speakerName,
    startDate,
    startTime,
    endTime,
    description,
    isRestricted
  }: CreateEventRequest): Promise<AppResponse> {
    const now = new Date()

    if (startDate < now) {
      throw new AppError(
        'A data de início do evento não pode estar no passado.',
        StatusCodes.BAD_REQUEST
      )
    }

    if (endTime <= startTime) {
      throw new AppError(
        'A hora de término deve ser posterior à hora de início.',
        StatusCodes.BAD_REQUEST
      )
    }

    if (maxParticipants <= 0) {
      throw new AppError(
        'O número máximo de participantes deve ser maior que zero.',
        StatusCodes.BAD_REQUEST
      )
    }

    // Get all events for this location and date
    const conflictingEvents = await prismaClient.event.findMany({
      where: {
        location,
        startDate,
        // Checks if the new event overlaps with any existing event
        OR: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime }
          }
        ]
      }
    })

    if (conflictingEvents.length > 0) {
      throw new AppError(
        'O horário selecionado conflita com outro evento já cadastrado.',
        StatusCodes.CONFLICT
      )
    }

    const event = await prismaClient.event.create({
      data: {
        name,
        category,
        course,
        semester,
        maxParticipants,
        location,
        customLocation,
        speakerName,
        startDate,
        startTime,
        endTime,
        description,
        isRestricted
      }
    })

    return {
      data: event,
      message: 'Evento criado com sucesso!'
    }
  }
}

export { CreateEventService }
