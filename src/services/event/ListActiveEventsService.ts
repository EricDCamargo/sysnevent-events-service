import prismaClient from '../../prisma'
import { AppResponse } from '../../@types/app.types'

class ListActiveEventsService {
  async execute(): Promise<AppResponse> {
    const events = await prismaClient.event.findMany({
      where: { status: true },
      orderBy: { date: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        date: true,
        location: true,
        capacity: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return {
      data: events,
      message: 'Eventos ativos listados com sucesso!'
    }
  }
}

export { ListActiveEventsService }
