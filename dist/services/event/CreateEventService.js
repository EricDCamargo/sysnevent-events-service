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
exports.CreateEventService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
class CreateEventService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, banner, categoryId, course, semester, maxParticipants, location, customLocation, speakerName, startDate, startTime, endTime, description, isRestricted, duration }) {
            const categoryExists = yield prisma_1.default.category.findUnique({
                where: { id: categoryId }
            });
            if (!categoryExists) {
                throw new AppError_1.AppError('Categoria não encontrada.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const startDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());
            const now = new Date();
            if (startDateTime < now) {
                throw new AppError_1.AppError('A data e hora de início do evento não podem estar no passado.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const diffMs = endTime.getTime() - startTime.getTime();
            if (diffMs < 30 * 60 * 1000) {
                throw new AppError_1.AppError('O evento precisa ter duração mínima de 30 minutos.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            if (endTime <= startTime) {
                throw new AppError_1.AppError('A hora de término deve ser posterior à hora de início.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            if (maxParticipants <= 0) {
                throw new AppError_1.AppError('O número máximo de participantes deve ser maior que zero.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // Get all events for this location and date
            const conflictingEvents = yield prisma_1.default.event.findMany({
                where: {
                    location,
                    startDate,
                    // Checks if the new event overlaps with any existing event
                    OR: [
                        {
                            startTime: { lt: endTime },
                            endTime: { gt: startTime }
                        }
                    ]
                }
            });
            if (conflictingEvents.length > 0) {
                throw new AppError_1.AppError('O horário selecionado conflita com outro evento já cadastrado.', http_status_codes_1.StatusCodes.CONFLICT);
            }
            const event = yield prisma_1.default.event.create({
                data: {
                    name,
                    categoryId,
                    course,
                    semester,
                    maxParticipants,
                    location,
                    customLocation,
                    speakerName,
                    startDate,
                    startTime,
                    endTime,
                    description,
                    isRestricted,
                    duration,
                    banner
                }
            });
            return {
                data: event,
                message: 'Evento criado com sucesso!'
            };
        });
    }
}
exports.CreateEventService = CreateEventService;
