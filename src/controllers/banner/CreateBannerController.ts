import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { UploadedFile } from 'express-fileupload'
import { uploadToCloudinary } from '../../lib/cloudinaryUpload'
import { CreateBannerService } from '../../services/banner/CreateBannerService'

export class CreateBannerController {
  async handle(req: Request, res: Response) {
    try {
      const { name, order } = req.body

      if (!name) {
        throw new AppError(
          'Nome do baner é obrigatório.',
          StatusCodes.BAD_REQUEST
        )
      }

      if (!req.files || !req.files['file']) {
        throw new AppError(
          'Imagem do baner é obrigatória.',
          StatusCodes.BAD_REQUEST
        )
      }

      const file = req.files['file'] as UploadedFile

      if (!file.mimetype.startsWith('image/')) {
        throw new AppError(
          'Arquivo inválido. Envie uma imagem.',
          StatusCodes.BAD_REQUEST
        )
      }

      const uploadResult = await uploadToCloudinary(file)

      const service = new CreateBannerService()
      const result = await service.execute({
        name,
        imageUrl: uploadResult.url,
        order: Number(order)
      })

      return res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao criar baner.' })
    }
  }
}
