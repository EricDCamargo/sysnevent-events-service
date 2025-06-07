import prisma from '../../prisma'
import { Category } from '@prisma/client'

interface ListEventsFilters {
  category?: Category
  startDate?: string
  endDate?: string
}

class ListEventsService {
  async execute(filters: ListEventsFilters) {
    const { category, startDate, endDate } = filters

    const where: any = {}

    if (category) {
      where.category = category
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

    return events
  }
}

export { ListEventsService }
