import { AppResponse } from '../../@types/app.types'
import prisma from '../../prisma'
import { Location } from '@prisma/client'

const MIN_SLOT_MINUTES = Number(process.env.MIN_SLOT_MINUTES) || 20
const DAY_START_HOUR = process.env.DAY_START_HOUR || '00:00'
const DAY_END_HOUR = process.env.DAY_END_HOUR || '23:59'

function toTimeString(date: Date) {
  return date.toTimeString().slice(0, 5)
}

class CheckAvailableTimeSlotsService {
  async execute(
    location: Location,
    date: string,
    ignoreEventId?: string
  ): Promise<AppResponse> {
    // Search all events for the given location and date
    const events = await prisma.event.findMany({
      where: {
        location,
        startDate: new Date(date),
        ...(ignoreEventId && { id: { not: ignoreEventId } })
      },
      select: {
        startTime: true,
        endTime: true
      },
      orderBy: { startTime: 'asc' }
    })

    // Defines the start and end of the working day
    const dayStart = new Date(`${date}T${DAY_START_HOUR}`)
    const dayEnd = new Date(`${date}T${DAY_END_HOUR}`)

    // Maps events to busy intervals (occupied time slots)
    const busyIntervals = events.map(e => ({
      start: e.startTime,
      end: e.endTime
    }))

    const allIntervals = [
      { start: dayStart, end: dayStart },
      ...busyIntervals,
      { start: dayEnd, end: dayEnd }
    ].sort((a, b) => a.start.getTime() - b.start.getTime())

    const availableSlots: { start: string; end: string }[] = []

    // Iterates through all intervals to find available slots between them
    for (let i = 0; i < allIntervals.length - 1; i++) {
      const currentEnd = allIntervals[i].end
      const nextStart = allIntervals[i + 1].start
      const diff = (nextStart.getTime() - currentEnd.getTime()) / 60000
      if (diff >= MIN_SLOT_MINUTES) {
        availableSlots.push({
          start: toTimeString(currentEnd),
          end: toTimeString(nextStart)
        })
      }
    }

    return {
      data: availableSlots,
      message: 'Lista de intervalos de tempo disponiveis'
    }
  }
}

export { CheckAvailableTimeSlotsService }
