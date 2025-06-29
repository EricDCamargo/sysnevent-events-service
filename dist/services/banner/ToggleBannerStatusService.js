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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleBannerStatusService = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = __importDefault(require("../../prisma"));
const AppError_1 = require("../../errors/AppError");
class ToggleBannerStatusService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ bannerId }) {
            const banner = yield prisma_1.default.banner.findUnique({
                where: { id: bannerId }
            });
            if (!banner) {
                throw new AppError_1.AppError('Banner não encontrado', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const updatedBanner = yield prisma_1.default.banner.update({
                where: { id: bannerId },
                data: {
                    isActive: !banner.isActive
                }
            });
            return {
                message: updatedBanner.isActive
                    ? 'Baner ativado com sucesso!'
                    : 'Baner desativado com sucesso!'
            };
        });
    }
}
exports.ToggleBannerStatusService = ToggleBannerStatusService;
