"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBannerController = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const cloudinaryUpload_1 = require("../../lib/cloudinaryUpload");
const CreateBannerService_1 = require("../../services/banner/CreateBannerService");
class CreateBannerController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, order } = req.body;
                if (!name) {
                    throw new AppError_1.AppError('Nome do banner é obrigatório.', http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                if (!req.files || !req.files['file']) {
                    throw new AppError_1.AppError('Imagem do banner é obrigatória.', http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                const file = req.files['file'];
                if (!file.mimetype.startsWith('image/')) {
                    throw new AppError_1.AppError('Arquivo inválido. Envie uma imagem.', http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                const uploadResult = yield (0, cloudinaryUpload_1.uploadToCloudinary)(file);
                const service = new CreateBannerService_1.CreateBannerService();
                const result = yield service.execute({
                    name,
                    imageUrl: uploadResult.url,
                    order: Number(order)
                });
                return res.status(http_status_codes_1.StatusCodes.CREATED).json(result);
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    return res.status(error.statusCode).json({ error: error.message });
                }
                return res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Erro interno ao criar banner.' });
            }
        });
    }
}
exports.CreateBannerController = CreateBannerController;
