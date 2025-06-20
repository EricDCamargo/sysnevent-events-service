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
exports.uploadToCloudinary = uploadToCloudinary;
const AppError_1 = require("../errors/AppError");
const http_status_codes_1 = require("http-status-codes");
const cloudinary_1 = require("./cloudinary");
function uploadToCloudinary(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.cloudinary.uploader.upload_stream({}, (error, result) => {
                if (error || !result) {
                    reject(error || new AppError_1.AppError(`Falha no upload Cloudinary: ${(error === null || error === void 0 ? void 0 : error.message) || 'Erro desconhecido'}`, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
                    return;
                }
                resolve(result);
            });
            uploadStream.end(file.data);
        });
    });
}
