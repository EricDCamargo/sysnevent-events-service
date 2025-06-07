import prisma from '../../prisma'
import { Location } from '@prisma/client'

const MIN_SLOT_MINUTES = Number(process.env.MIN_SLOT_MINUTES) || 20
const DAY_START_HOUR = process.env.DAY_START_HOUR || '00:00'
const DAY_END_HOUR = process.env.DAY_END_HOUR || '23:59'

class CheckUnavailableDatesService {
  async execute(location: Location) {
    // Search all events for the given location and date
    const events = await prisma.event.findMany({
      where: { location },
      select: {
        startDate: true,
        startTime: true,
        endTime: true
      }
    })
    // Group events by day
    const eventsByDay: Record<string, { start: Date; end: Date }[]> = {}

    for (const event of events) {
      const dayKey = event.startDate.toISOString().split('T')[0]
      if (!eventsByDay[dayKey]) eventsByDay[dayKey] = []
      eventsByDay[dayKey].push({ start: event.startTime, end: event.endTime })
    }

    const unavailableDays: string[] = []

    // For each day, check if there is any available slot
    for (const [day, intervals] of Object.entries(eventsByDay)) {
      const dayStart = new Date(`${day}T${DAY_START_HOUR}`)
      const dayEnd = new Date(`${day}T${DAY_END_HOUR}`)
      // Sort intervals by start time
      const sorted = intervals.sort(
        (a, b) => a.start.getTime() - b.start.getTime()
      )

      let lastEnd = dayStart
      let hasSlot = false

      // Check for available slots between events
      for (const interval of sorted) {
        const diff = (interval.start.getTime() - lastEnd.getTime()) / 60000
        // If there is a slot greater than or equal to the minimum, mark as available
        if (diff >= MIN_SLOT_MINUTES) {
          hasSlot = true
          break
        }
        // Update lastEnd to the end of the current interval if it is later
        if (interval.end > lastEnd) lastEnd = interval.end
      }

      // Check for available slot after the last event until the end of the day
      const diffEnd = (dayEnd.getTime() - lastEnd.getTime()) / 60000
      if (diffEnd >= MIN_SLOT_MINUTES) hasSlot = true

      // If no slot is available, add the day to the unavailable list
      if (!hasSlot) unavailableDays.push(day)
    }

    return { unavailableDates: unavailableDays }
  }
}

export { CheckUnavailableDatesService }
