import { UploadApiResponse } from 'cloudinary'
import { UploadedFile } from 'express-fileupload'
import { AppError } from '../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { cloudinary } from './cloudinary'


export async function uploadToCloudinary(file: UploadedFile): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({}, (error: any, result) => {
      if (error || !result) {
        reject(error || new AppError(`Falha no upload Cloudinary: ${error?.message || 'Erro desconhecido'}`, StatusCodes.INTERNAL_SERVER_ERROR))
        return
      }
      resolve(result)
    })

    uploadStream.end(file.data)
  })
}
