import prismaClient from '../../prisma'
import { AppResponse } from '../../@types/app.types'

interface ListMyEventsRequest {
  user_id: string
}

class ListMyEventsService {
  async execute({ user_id }: ListMyEventsRequest): Promise<AppResponse> {
    const events = await prismaClient.event.findMany({
      where: {
        ownerId: user_id
      },
      orderBy: {
        date: 'asc'
      },
      select: {
        id: true,
        name: true,
        description: true,
        date: true,
        location: true,
        capacity: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return {
      data: events,
      message: 'Eventos do usuário listados com sucesso!'
    }
  }
}

export { ListMyEventsService }
