import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { UpdateEventService } from '../../services/event/UpdateEventService'
import prismaClient from '../../prisma'
import { FIXED_CATEGORIES } from '../../@types/types'
import { Course, Semester } from '@prisma/client'

class UpdateEventController {
  async handle(req: Request, res: Response) {
    const event_id = req.query.event_id as string
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

    if (!event_id) {
      throw new AppError(
        'É necessario informar o ID do evento',
        StatusCodes.BAD_REQUEST
      )
    }

    let category = null

    if (categoryId) {
      category = await prismaClient.category.findUnique({
        where: { id: categoryId }
      })

      if (!category) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Categoria informada é inválida'
        })
      }
    }

    if (course && !(course in Course)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Curso inválido' })
    }
    if (semester && !(semester in Semester)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Semestre inválido' })
    }
    if (location && !(location in Location)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Localização inválida' })
    }

    const fixedCursoOnline = await prismaClient.category.findFirst({
      where: {
        name: FIXED_CATEGORIES.CURSO_ONLINE.name
      }
    })

    let finalLocation = location
    let finalCustomLocation = customLocation

    if (category && fixedCursoOnline && category.id === fixedCursoOnline.id) {
      if (!duration || duration <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error:
            'Campo "duration" é obrigatório para eventos do tipo Curso Online e deve ser maior que 0.'
        })
      }
      finalLocation = FIXED_CATEGORIES.CURSO_ONLINE.enforcedLocation
      finalCustomLocation = FIXED_CATEGORIES.CURSO_ONLINE.customLocation
    }

    const updateEventService = new UpdateEventService()

    try {
      const result = await updateEventService.execute({
        event_id,
        name,
        categoryId,
        course,
        semester,
        maxParticipants,
        location: finalLocation,
        customLocation: finalCustomLocation,
        speakerName,
        startDate,
        startTime,
        endTime,
        description,
        isRestricted,
        duration
      })

      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao atualizar evento' })
    }
  }
}

export { UpdateEventController }
