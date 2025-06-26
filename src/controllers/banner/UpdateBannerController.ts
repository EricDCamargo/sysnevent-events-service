import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { UploadedFile } from 'express-fileupload'
import { uploadToCloudinary } from '../../lib/cloudinaryUpload'
import { UpdateBannerService } from '../../services/banner/UpdateBannerService'

export class UpdateBannerController {
  async handle(req: Request, res: Response) {
    try {
      const id = req.query.id as string
      const { name, order, isActive } = req.body

      if (!id) {
        throw new AppError(
          'ID do baner é obrigatório.',
          StatusCodes.BAD_REQUEST
        )
      }

      let imageUrl: string | undefined

      if (req.files && req.files['file']) {
        const file = req.files['file'] as UploadedFile

        if (!file.mimetype.startsWith('image/')) {
          throw new AppError(
            'Arquivo inválido. Envie uma imagem.',
            StatusCodes.BAD_REQUEST
          )
        }

        const result = await uploadToCloudinary(file)
        imageUrl = result.url
      }

      const service = new UpdateBannerService()
      const result = await service.execute({
        id,
        name,
        order: order !== undefined ? Number(order) : undefined,
        imageUrl,
        isActive:
          isActive !== undefined
            ? isActive === 'true' || isActive === true
            : undefined
      })

      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao atualizar baner.' })
    }
  }
}
