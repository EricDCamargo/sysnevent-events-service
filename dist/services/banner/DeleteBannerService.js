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
exports.DeleteBannerService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteBannerService {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const banner = yield prisma_1.default.banner.findUnique({ where: { id } });
            if (!banner) {
                throw new AppError_1.AppError('Baner não encontrado.', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            // Deleta o banner
            yield prisma_1.default.banner.delete({ where: { id } });
            // Reorganiza as ordens dos banners que estavam depois do deletado
            yield prisma_1.default.banner.updateMany({
                where: {
                    order: {
                        gt: banner.order
                    }
                },
                data: {
                    order: {
                        decrement: 1
                    }
                }
            });
            return { message: 'Baner deletado com sucesso.' };
        });
    }
}
exports.DeleteBannerService = DeleteBannerService;
