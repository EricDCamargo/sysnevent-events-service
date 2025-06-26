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
exports.UpdateBannerService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateBannerService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, name, imageUrl, order, isActive }) {
            const banner = yield prisma_1.default.banner.findUnique({ where: { id } });
            if (!banner) {
                throw new AppError_1.AppError('Banner não encontrado.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const updates = {};
            if (name)
                updates.name = name;
            if (typeof imageUrl === 'string')
                updates.imageUrl = imageUrl;
            if (typeof isActive === 'boolean')
                updates.isActive = isActive;
            if (order !== undefined && order !== null && order !== banner.order) {
                if (order < 1) {
                    throw new AppError_1.AppError('A ordem do banner deve ser maior ou igual a 1.', http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                const totalBanners = yield prisma_1.default.banner.count();
                if (order > totalBanners) {
                    throw new AppError_1.AppError(`A ordem máxima permitida atualmente é ${totalBanners}.`, http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                // Ajuste das ordens: libera a posição antiga, empurra quem está entre a nova e antiga
                if (order < banner.order) {
                    // Está subindo na lista → banners entre a nova e a antiga ordem descem
                    yield prisma_1.default.banner.updateMany({
                        where: {
                            order: {
                                gte: order,
                                lt: banner.order
                            },
                            id: {
                                not: banner.id
                            }
                        },
                        data: {
                            order: {
                                increment: 1
                            }
                        }
                    });
                }
                else {
                    // Está descendo na lista → banners entre a antiga e nova ordem sobem
                    yield prisma_1.default.banner.updateMany({
                        where: {
                            order: {
                                gt: banner.order,
                                lte: order
                            },
                            id: {
                                not: banner.id
                            }
                        },
                        data: {
                            order: {
                                decrement: 1
                            }
                        }
                    });
                }
                updates.order = order;
            }
            const updated = yield prisma_1.default.banner.update({
                where: { id },
                data: updates
            });
            return {
                data: updated,
                message: 'Banner atualizado com sucesso.'
            };
        });
    }
}
exports.UpdateBannerService = UpdateBannerService;
