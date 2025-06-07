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
exports.UpdateEventService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const AppError_1 = require("../../errors/AppError");
const http_status_codes_1 = require("http-status-codes");
class UpdateEventService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ event_id, name, category, course, semester, maxParticipants, location, customLocation, speakerName, startDate, startTime, endTime, description }) {
            const event = yield prisma_1.default.event.findUnique({
                where: { id: event_id }
            });
            if (!event) {
                throw new AppError_1.AppError('Evento não encontrado!', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            // Use existing values if not provided
            const newStartDate = startDate !== null && startDate !== void 0 ? startDate : event.startDate;
            const newStartTime = startTime !== null && startTime !== void 0 ? startTime : event.startTime;
            const newEndTime = endTime !== null && endTime !== void 0 ? endTime : event.endTime;
            const newLocation = location !== null && location !== void 0 ? location : event.location;
            // Validate time logic
            if (newEndTime <= newStartTime) {
                throw new AppError_1.AppError('A hora de término deve ser posterior à hora de início.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // Check for conflicting events (excluding this event)
            const conflictingEvents = yield prisma_1.default.event.findMany({
                where: {
                    id: { not: event_id },
                    location: newLocation,
                    startDate: newStartDate,
                    OR: [
                        {
                            startTime: { lt: newEndTime },
                            endTime: { gt: newStartTime }
                        }
                    ]
                }
            });
            if (conflictingEvents.length > 0) {
                throw new AppError_1.AppError('O horário selecionado conflita com outro evento já cadastrado.', http_status_codes_1.StatusCodes.CONFLICT);
            }
            const updatedEvent = yield prisma_1.default.event.update({
                where: { id: event_id },
                data: {
                    name: name !== null && name !== void 0 ? name : event.name,
                    category: category !== null && category !== void 0 ? category : event.category,
                    course: course !== null && course !== void 0 ? course : event.course,
                    semester: semester !== null && semester !== void 0 ? semester : event.semester,
                    maxParticipants: maxParticipants !== null && maxParticipants !== void 0 ? maxParticipants : event.maxParticipants,
                    location: newLocation,
                    customLocation: customLocation !== null && customLocation !== void 0 ? customLocation : event.customLocation,
                    speakerName: speakerName !== null && speakerName !== void 0 ? speakerName : event.speakerName,
                    startDate: newStartDate,
                    startTime: newStartTime,
                    endTime: newEndTime,
                    description: description !== null && description !== void 0 ? description : event.description
                },
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
                    created_at: true,
                    updated_at: true
                }
            });
            return {
                data: updatedEvent,
                message: 'Evento atualizado com sucesso!'
            };
        });
    }
}
exports.UpdateEventService = UpdateEventService;
