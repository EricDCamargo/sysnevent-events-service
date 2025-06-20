import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { UpdateEventService } from '../../services/event/UpdateEventService'
import prismaClient from '../../prisma'
import { FIXED_CATEGORIES } from '../../@types/types'
import { Course, Semester, Location } from '@prisma/client'
import { UploadedFile } from 'express-fileupload'
import { uploadToCloudinary } from '../../lib/cloudinaryUpload'

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
        'É necessário informar o ID do evento',
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

    const isCursoOnline =
      category && fixedCursoOnline && category.id === fixedCursoOnline.id

    let finalLocation = location
    let finalCustomLocation = customLocation

    if (isCursoOnline) {
      if (!duration || duration <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error:
            'Campo "duration" é obrigatório para eventos do tipo Curso Online e deve ser maior que 0.'
        })
      }

      finalLocation = FIXED_CATEGORIES.CURSO_ONLINE.enforcedLocation
      finalCustomLocation = FIXED_CATEGORIES.CURSO_ONLINE.customLocation
    } else {
      if (location === 'OUTROS') {
        if (!customLocation) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error:
              'Para eventos com localização "OUTROS", é necessário preencher o campo customLocation.'
          })
        }
        finalCustomLocation = customLocation
      } else {
        finalCustomLocation = null
      }
    }

    // Obter startDate atual para validação de horário
    let currentStartDate: Date | undefined = undefined

    if (startTime || endTime) {
      if (startDate) {
        const parsedStartDate = new Date(startDate)
        if (isNaN(parsedStartDate.getTime())) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'startDate inválido. Precisa ser um DateTime válido.'
          })
        }
        currentStartDate = parsedStartDate
      } else {
        const existingEvent = await prismaClient.event.findUnique({
          where: { id: event_id },
          select: { startDate: true }
        })

        if (!existingEvent) {
          return res.status(StatusCodes.NOT_FOUND).json({
            error: 'Evento não encontrado'
          })
        }

        currentStartDate = existingEvent.startDate
      }

      if (startTime) {
        const parsedStartTime = new Date(startTime)
        if (isNaN(parsedStartTime.getTime())) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'startTime inválido. Precisa ser um DateTime válido.'
          })
        }

        if (
          parsedStartTime.toDateString() !== currentStartDate.toDateString()
        ) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'startTime precisa ser no mesmo dia do startDate.'
          })
        }
      }

      if (endTime) {
        const parsedEndTime = new Date(endTime)
        if (isNaN(parsedEndTime.getTime())) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'endTime inválido. Precisa ser um DateTime válido.'
          })
        }

        if (parsedEndTime.toDateString() !== currentStartDate.toDateString()) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'endTime precisa ser no mesmo dia do startDate.'
          })
        }
      }
    }

    let bannerUrl: string | undefined = undefined

    if (req.files && req.files['file']) {
      const file: UploadedFile = req.files['file'] as UploadedFile
      if (!file.mimetype.startsWith('image/')) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Formato de arquivo inválido. Apenas imagens são permitidas.'
        })
      }
      const resultFile = await uploadToCloudinary(file)
      bannerUrl = resultFile.url
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
        duration,
        banner: bannerUrl
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
