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
exports.GetEventDetailsService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const AppError_1 = require("../../errors/AppError");
const http_status_codes_1 = require("http-status-codes");
class GetEventDetailsService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ event_id }) {
            const event = yield prisma_1.default.event.findUnique({
                where: { id: event_id },
                select: {
                    id: true,
                    name: true,
                    category: true,
                    course: true,
                    semester: true,
                    maxParticipants: true,
                    currentParticipants: true,
                    location: true,
                    customLocation: true,
                    speakerName: true,
                    startDate: true,
                    startTime: true,
                    endTime: true,
                    description: true,
                    isRestricted: true,
                    created_at: true,
                    updated_at: true
                }
            });
            if (!event) {
                throw new AppError_1.AppError('Evento não encontrado!', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return {
                data: event,
                message: 'Detalhes do evento obtidos com sucesso!'
            };
        });
    }
}
exports.GetEventDetailsService = GetEventDetailsService;
