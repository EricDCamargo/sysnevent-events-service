import prismaClient from '../../prisma'
import { AppError } from '../../errors/AppError'
import { AppResponse } from '../../@types/app.types'
import { StatusCodes } from 'http-status-codes'

interface GetEventDetailsRequest {
  event_id: string
}

class GetEventDetailsService {
  async execute({ event_id }: GetEventDetailsRequest): Promise<AppResponse> {
    const event = await prismaClient.event.findUnique({
      where: { id: event_id },
      select: {
        id: true,
        name: true,
        category: true,
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
        created_at: true,
        updated_at: true
      }
    })

    if (!event) {
      throw new AppError('Evento não encontrado!', StatusCodes.NOT_FOUND)
    }

    return {
      data: event,
      message: 'Detalhes do evento obtidos com sucesso!'
    }
  }
}

export { GetEventDetailsService }
