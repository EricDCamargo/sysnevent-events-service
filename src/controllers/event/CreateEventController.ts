import { Course, Location, Semester } from '@prisma/client'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { CreateEventService } from '../../services/event/CreateEventService'
import prismaClient from '../../prisma'
import { FIXED_CATEGORIES } from '../../@types/types'
import { UploadedFile } from 'express-fileupload'
import { uploadToCloudinary } from '../../lib/cloudinaryUpload'

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

    if (!req.files || Object.keys(req.files).length === 0) {
      throw new AppError(
        'Nenhum arquivo de imagem foi enviado.',
        StatusCodes.BAD_REQUEST
      )
    }
    const file: UploadedFile = req.files['file'] as UploadedFile

    if (!file.mimetype.startsWith('image/')) {
      throw new AppError(
        'Formato de arquivo inválido. Apenas imagens são permitidas.',
        StatusCodes.BAD_REQUEST
      )
    }

    const resultFile = await uploadToCloudinary(file)

    const category = await prismaClient.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Categoria informada é inválida'
      })
    }

    const fixedCursoOnline = await prismaClient.category.findFirst({
      where: {
        name: FIXED_CATEGORIES.CURSO_ONLINE.name
      }
    })

    const isCursoOnline =
      fixedCursoOnline && category.id === fixedCursoOnline.id

    // Monta lista de campos obrigatórios
    const missingFields = []
    if (!name) missingFields.push('name')
    if (!course) missingFields.push('course')
    if (!maxParticipants || maxParticipants <= 0)
      missingFields.push('maxParticipants')
    if (!speakerName) missingFields.push('speakerName')
    if (!startDate) missingFields.push('startDate')
    if (!startTime) missingFields.push('startTime')
    if (!endTime) missingFields.push('endTime')
    if (!description) missingFields.push('description')

    // Validação condicional de location
    if (!isCursoOnline && !location) {
      missingFields.push('location')
    }

    // Se location for OUTROS, customLocation vira obrigatório
    if (!isCursoOnline && location === 'OUTROS' && !customLocation) {
      missingFields.push('customLocation')
    }

    if (missingFields.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`
      })
    }

    // Validação de enums
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

    if (!isCursoOnline && !(location in Location)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Localização inválida' })
    }

    // Parse de datas
    const parsedStartDate = new Date(startDate)
    const parsedStartTime = new Date(startTime)
    const parsedEndTime = new Date(endTime)

    if (
      isNaN(parsedStartDate.getTime()) ||
      isNaN(parsedStartTime.getTime()) ||
      isNaN(parsedEndTime.getTime())
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'startDate, startTime e endTime precisam ser DateTimes válidos'
      })
    }

    // Garantir que startTime e endTime estejam no mesmo dia que startDate
    const sameDay = (a: Date, b: Date) =>
      a.getUTCFullYear() === b.getUTCFullYear() &&
      a.getUTCMonth() === b.getUTCMonth() &&
      a.getUTCDate() === b.getUTCDate()

    if (
      !sameDay(parsedStartTime, parsedStartDate) ||
      !sameDay(parsedEndTime, parsedStartDate)
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'startTime e endTime precisam estar no mesmo dia do startDate'
      })
    }

    // Regras específicas para Curso Online
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
    }

    const parsedMaxParticipants = Number(maxParticipants)
    const parsedDuration = duration !== undefined ? Number(duration) : undefined
    const parsedIsRestricted =
      isRestricted !== undefined
        ? isRestricted === 'true' || isRestricted === true
        : undefined

    // Chamada ao Service
    const createEventService = new CreateEventService()

    try {
      const result = await createEventService.execute({
        name,
        categoryId,
        course,
        semester,
        maxParticipants: parsedMaxParticipants,
        location: finalLocation,
        customLocation: finalCustomLocation,
        speakerName,
        startDate: parsedStartDate,
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        description,
        isRestricted: parsedIsRestricted,
        duration: parsedDuration,
        banner: resultFile.url
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
