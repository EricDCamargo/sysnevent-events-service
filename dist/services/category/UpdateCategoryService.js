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
exports.UpdateCategoryService = void 0;
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
const http_status_codes_1 = require("http-status-codes");
const types_1 = require("../../@types/types");
class UpdateCategoryService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, name }) {
            const category = yield prisma_1.default.category.findUnique({ where: { id } });
            if (!category) {
                throw new AppError_1.AppError('Categoria não encontrada.', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (category.name === types_1.FIXED_CATEGORIES.CURSO_ONLINE.name) {
                throw new AppError_1.AppError(`Categoria ${types_1.FIXED_CATEGORIES.CURSO_ONLINE.name} não pode ser editada.`, http_status_codes_1.StatusCodes.FORBIDDEN);
            }
            const duplicate = yield prisma_1.default.category.findFirst({
                where: { name, NOT: { id } }
            });
            if (duplicate) {
                throw new AppError_1.AppError('Já existe outra categoria com esse nome.', http_status_codes_1.StatusCodes.CONFLICT);
            }
            const updated = yield prisma_1.default.category.update({
                where: { id },
                data: { name }
            });
            return {
                data: updated,
                message: 'Categoria atualizada com sucesso.'
            };
        });
    }
}
exports.UpdateCategoryService = UpdateCategoryService;
