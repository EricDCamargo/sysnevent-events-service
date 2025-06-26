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
exports.CreateBannerService = void 0;
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
class CreateBannerService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, imageUrl, order }) {
            let finalOrder;
            // Caso o valor esteja indefinido ou nulo ou não numérico
            if (order == null || isNaN(order)) {
                // Insere no topo da fila: ordem 1
                finalOrder = 1;
            }
            else if (order < 1) {
                throw new AppError_1.AppError('A ordem do banner deve ser maior ou igual a 1.');
            }
            else {
                finalOrder = order;
            }
            // Empurra os banners que têm ordem igual ou maior
            yield prisma_1.default.banner.updateMany({
                where: {
                    order: {
                        gte: finalOrder
                    }
                },
                data: {
                    order: {
                        increment: 1
                    }
                }
            });
            const banner = yield prisma_1.default.banner.create({
                data: {
                    name,
                    imageUrl,
                    order: finalOrder
                }
            });
            return banner;
        });
    }
}
exports.CreateBannerService = CreateBannerService;
