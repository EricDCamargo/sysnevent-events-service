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
exports.UpdateEventController = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const UpdateEventService_1 = require("../../services/event/UpdateEventService");
const prisma_1 = __importDefault(require("../../prisma"));
const types_1 = require("../../@types/types");
const client_1 = require("@prisma/client");
class UpdateEventController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const event_id = req.query.event_id;
            const { name, categoryId, course, semester, maxParticipants, location, customLocation, speakerName, startDate, startTime, endTime, description, isRestricted, duration } = req.body;
            if (!event_id) {
                throw new AppError_1.AppError('É necessário informar o ID do evento', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            let category = null;
            if (categoryId) {
                category = yield prisma_1.default.category.findUnique({
                    where: { id: categoryId }
                });
                if (!category) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        error: 'Categoria informada é inválida'
                    });
                }
            }
            if (course && !(course in client_1.Course)) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: 'Curso inválido' });
            }
            if (semester && !(semester in client_1.Semester)) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: 'Semestre inválido' });
            }
            if (location && !(location in client_1.Location)) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: 'Localização inválida' });
            }
            const fixedCursoOnline = yield prisma_1.default.category.findFirst({
                where: {
                    name: types_1.FIXED_CATEGORIES.CURSO_ONLINE.name
                }
            });
            const isCursoOnline = category &&
                fixedCursoOnline &&
                category.id === fixedCursoOnline.id;
            let finalLocation = location;
            let finalCustomLocation = customLocation;
            if (isCursoOnline) {
                if (!duration || duration <= 0) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        error: 'Campo "duration" é obrigatório para eventos do tipo Curso Online e deve ser maior que 0.'
                    });
                }
                finalLocation = types_1.FIXED_CATEGORIES.CURSO_ONLINE.enforcedLocation;
                finalCustomLocation = types_1.FIXED_CATEGORIES.CURSO_ONLINE.customLocation;
            }
            else {
                if (location === 'OUTROS') {
                    if (!customLocation) {
                        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                            error: 'Para eventos com localização "OUTROS", é necessário preencher o campo customLocation.'
                        });
                    }
                    finalCustomLocation = customLocation;
                }
                else {
                    finalCustomLocation = null;
                }
            }
            // Obter startDate atual para validação de horário
            let currentStartDate = undefined;
            if (startTime || endTime) {
                if (startDate) {
                    const parsedStartDate = new Date(startDate);
                    if (isNaN(parsedStartDate.getTime())) {
                        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                            error: 'startDate inválido. Precisa ser um DateTime válido.'
                        });
                    }
                    currentStartDate = parsedStartDate;
                }
                else {
                    const existingEvent = yield prisma_1.default.event.findUnique({
                        where: { id: event_id },
                        select: { startDate: true }
                    });
                    if (!existingEvent) {
                        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                            error: 'Evento não encontrado'
                        });
                    }
                    currentStartDate = existingEvent.startDate;
                }
                if (startTime) {
                    const parsedStartTime = new Date(startTime);
                    if (isNaN(parsedStartTime.getTime())) {
                        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                            error: 'startTime inválido. Precisa ser um DateTime válido.'
                        });
                    }
                    if (parsedStartTime.toDateString() !== currentStartDate.toDateString()) {
                        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                            error: 'startTime precisa ser no mesmo dia do startDate.'
                        });
                    }
                }
                if (endTime) {
                    const parsedEndTime = new Date(endTime);
                    if (isNaN(parsedEndTime.getTime())) {
                        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                            error: 'endTime inválido. Precisa ser um DateTime válido.'
                        });
                    }
                    if (parsedEndTime.toDateString() !== currentStartDate.toDateString()) {
                        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                            error: 'endTime precisa ser no mesmo dia do startDate.'
                        });
                    }
                }
            }
            const updateEventService = new UpdateEventService_1.UpdateEventService();
            try {
                const result = yield updateEventService.execute({
                    event_id,
                    name,
                    categoryId,
                    course,
                    semester,
                    maxParticipants,
                    location: finalLocation,
                    customLocation: finalCustomLocation,
                    speakerName,
                    startDate,
                    startTime,
                    endTime,
                    description,
                    isRestricted,
                    duration
                });
                return res.status(http_status_codes_1.StatusCodes.OK).json(result);
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    return res.status(error.statusCode).json({ error: error.message });
                }
                return res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Erro interno ao atualizar evento' });
            }
        });
    }
}
exports.UpdateEventController = UpdateEventController;
