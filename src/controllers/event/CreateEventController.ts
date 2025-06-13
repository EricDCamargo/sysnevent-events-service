import { Course, Location, Semester } from '@prisma/client'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { CreateEventService } from '../../services/event/CreateEventService'
import prismaClient from '../../prisma'
import { FIXED_CATEGORIES } from '../../@types/types'

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
      isRestricted,
      duration
    } = req.body

    const category = await prismaClient.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Categoria informada é inválida'
      })
    }

    const missingFields = []
    if (!name) missingFields.push('name')
    if (!course) missingFields.push('course')
    if (!maxParticipants || maxParticipants <= 0)
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

    if (!(location in Location)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Localização inválida' })
    }

    if (!(course in Course)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Curso inválido' })
    }

    if (semester && !(semester in Semester)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Semestre inválido' })
    }

    const fixedCursoOnline = await prismaClient.category.findFirst({
      where: {
        name: FIXED_CATEGORIES.CURSO_ONLINE.name
      }
    })

    let finalLocation = location
    let finalCustomLocation = customLocation

    if (fixedCursoOnline && category.id === fixedCursoOnline.id) {
      if (!duration || duration <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error:
            'Campo "duration" é obrigatório para eventos do tipo Curso Online e deve ser maior que 0.'
        })
      }
      finalLocation = FIXED_CATEGORIES.CURSO_ONLINE.enforcedLocation
      finalCustomLocation = FIXED_CATEGORIES.CURSO_ONLINE.customLocation
    }

    const createEventService = new CreateEventService()

    try {
      const result = await createEventService.execute({
        name,
        categoryId,
        course,
        semester,
        maxParticipants,
        location: finalLocation,
        customLocation: finalCustomLocation,
        speakerName,
        startDate: new Date(startDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description,
        isRestricted,
        duration
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
