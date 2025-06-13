import { Course, Location, Semester } from '@prisma/client'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { CreateEventService } from '../../services/event/CreateEventService'

class CreateEventController {
  async handle(req: Request, res: Response) {
    const {
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
      isRestricted
    } = req.body

    const missingFields = []
    if (!name) missingFields.push('name')
    if (!categoryId) missingFields.push('categoryId')
    if (!course) missingFields.push('course')
    if (!maxParticipants && maxParticipants <= 0)
      missingFields.push('maxParticipants')
    if (!location) missingFields.push('location')
    if (!speakerName) missingFields.push('speakerName')
    if (!startDate) missingFields.push('startDate')
    if (!startTime) missingFields.push('startTime')
    if (!endTime) missingFields.push('endTime')
    if (!description) missingFields.push('description')

    if (missingFields.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`
      })
    }

    const upperLocation = location.toUpperCase() as keyof typeof Location
    if (!(upperLocation in Location)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Invalid location' })
    }

    const upperCourse = course.toUpperCase() as keyof typeof Course
    if (!(upperCourse in Course)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Invalid course' })
    }

    const upperSemester = semester.toUpperCase() as keyof typeof Semester
    if (!(upperSemester in Semester)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Invalid semester' })
    }

    const createEventService = new CreateEventService()

    try {
      const result = await createEventService.execute({
        name,
        categoryId,
        course,
        semester,
        maxParticipants,
        location: Location[upperLocation],
        customLocation,
        speakerName,
        startDate: new Date(startDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description,
        isRestricted
      })

      return res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao criar evento' })
    }
  }
}

export { CreateEventController }
