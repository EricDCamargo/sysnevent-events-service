import { AppResponse } from '../../@types/app.types'
import prisma from '../../prisma'

interface ListEventsFilters {
  categoryId?: string
  startDate?: string
  endDate?: string
}

class ListEventsService {
  async execute(filters: ListEventsFilters): Promise<AppResponse> {
    const { categoryId, startDate, endDate } = filters

    const where: any = {}

    if (categoryId) {
      where.categoryId = categoryId
    }
    if (startDate) {
      where.startDate = { gte: new Date(startDate) }
    }
    if (endDate) {
      where.startDate = where.startDate
        ? { ...where.startDate, lte: new Date(endDate) }
        : { lte: new Date(endDate) }
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: 'asc' }
    })

    return {
      data: events,
      message: 'Lista de eventos obtidos com sucesso!'
    }
  }
}

export { ListEventsService }
