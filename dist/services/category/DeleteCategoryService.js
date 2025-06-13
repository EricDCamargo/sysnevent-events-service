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
exports.DeleteCategoryService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const AppError_1 = require("../../errors/AppError");
const http_status_codes_1 = require("http-status-codes");
const types_1 = require("../../@types/types");
class DeleteCategoryService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const category = yield prisma_1.default.category.findUnique({ where: { id } });
            if (!category) {
                throw new AppError_1.AppError('Categoria não encontrada.', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (category.name === types_1.FIXED_CATEGORIES.CURSO_ONLINE.name) {
                throw new AppError_1.AppError(`Categoria ${types_1.FIXED_CATEGORIES.CURSO_ONLINE.name} não pode ser excluida.`, http_status_codes_1.StatusCodes.FORBIDDEN);
            }
            yield prisma_1.default.category.delete({ where: { id } });
            return {
                message: 'Categoria excluída com sucesso.'
            };
        });
    }
}
exports.DeleteCategoryService = DeleteCategoryService;
