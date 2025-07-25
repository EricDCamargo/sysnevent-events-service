import prismaClient from '../../prisma'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { Course, Semester, Location } from '@prisma/client'
import { AppResponse } from '../../@types/app.types'

interface UpdateEventRequest {
  event_id: string
  name?: string
  categoryId?: string
  course?: Course
  semester?: Semester
  maxParticipants?: number
  location?: Location
  customLocation?: string
  speakerName?: string
  startDate?: Date
  startTime?: Date
  endTime?: Date
  description?: string
  isRestricted?: boolean
  duration?: number
  banner?: string
}

class UpdateEventService {
  async execute({
    event_id,
    name,
    categoryId,
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
    isRestricted,
    duration,
    banner
  }: UpdateEventRequest): Promise<AppResponse> {
    const event = await prismaClient.event.findUnique({
      where: { id: event_id }
    })

    if (!event) {
      throw new AppError('Evento não encontrado!', StatusCodes.NOT_FOUND)
    }

    // Use existing values if not provided
    const newStartDate = startDate ?? event.startDate
    const newStartTime = startTime ?? event.startTime
    const newEndTime = endTime ?? event.endTime
    const newLocation = location ?? event.location

    // Validate time logic
    if (newEndTime <= newStartTime) {
      throw new AppError(
        'A hora de término deve ser posterior à hora de início.',
        StatusCodes.BAD_REQUEST
      )
    }

    // Check for conflicting events (excluding this event)
    const conflictingEvents = await prismaClient.event.findMany({
      where: {
        id: { not: event_id },
        location: newLocation,
        startDate: newStartDate,
        OR: [
          {
            startTime: { lt: newEndTime },
            endTime: { gt: newStartTime }
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

    const updatedEvent = await prismaClient.event.update({
      where: { id: event_id },
      data: {
        name: name ?? event.name,
        categoryId: categoryId ?? event.categoryId,
        course: course ?? event.course,
        semester: semester ?? event.semester,
        maxParticipants: maxParticipants ?? event.maxParticipants,
        location: newLocation,
        customLocation: customLocation ?? event.customLocation,
        speakerName: speakerName ?? event.speakerName,
        startDate: newStartDate,
        startTime: newStartTime,
        endTime: newEndTime,
        description: description ?? event.description,
        isRestricted: isRestricted ?? event.isRestricted,
        duration: duration ?? event.duration,
        banner: banner ?? event.banner,
        updated_at: new Date()
      },
      select: {
        id: true,
        name: true,
        categoryId: true,
        course: true,
        semester: true,
        maxParticipants: true,
        currentParticipants: true,
        location: true,
        customLocation: true,
        speakerName: true,
        startDate: true,
        startTime: true,
        endTime: true,
        description: true,
        isRestricted: true,
        duration: true,
        banner: true,
        created_at: true,
        updated_at: true
      }
    })

    return {
      data: updatedEvent,
      message: 'Evento atualizado com sucesso!'
    }
  }
}

export { UpdateEventService }
