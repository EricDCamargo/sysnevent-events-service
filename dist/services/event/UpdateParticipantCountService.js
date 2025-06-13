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
exports.UpdateParticipantCountService = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = __importDefault(require("../../prisma"));
const AppError_1 = require("../../errors/AppError");
class UpdateParticipantCountService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ eventId, action }) {
            const event = yield prisma_1.default.event.findUnique({
                where: { id: eventId }
            });
            if (!event) {
                throw new AppError_1.AppError('Evento não encontrado', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (action === 'decrement' && event.currentParticipants === 0) {
                throw new AppError_1.AppError('currentParticipants já está em zero', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            yield prisma_1.default.event.update({
                where: { id: eventId },
                data: {
                    currentParticipants: {
                        [action]: 1
                    }
                }
            });
        });
    }
}
exports.UpdateParticipantCountService = UpdateParticipantCountService;
