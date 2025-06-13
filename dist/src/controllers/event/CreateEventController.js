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
exports.CreateEventController = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const CreateEventService_1 = require("../../services/event/CreateEventService");
const prisma_1 = __importDefault(require("../../prisma"));
const types_1 = require("../../@types/types");
class CreateEventController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, categoryId, course, semester, maxParticipants, location, customLocation, speakerName, startDate, startTime, endTime, description, isRestricted, duration } = req.body;
            const category = yield prisma_1.default.category.findUnique({
                where: { id: categoryId }
            });
            if (!category) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    error: 'Categoria informada é inválida'
                });
            }
            const missingFields = [];
            if (!name)
                missingFields.push('name');
            if (!course)
                missingFields.push('course');
            if (!maxParticipants || maxParticipants <= 0)
                missingFields.push('maxParticipants');
            if (!location)
                missingFields.push('location');
            if (!speakerName)
                missingFields.push('speakerName');
            if (!startDate)
                missingFields.push('startDate');
            if (!startTime)
                missingFields.push('startTime');
            if (!endTime)
                missingFields.push('endTime');
            if (!description)
                missingFields.push('description');
            if (missingFields.length > 0) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    error: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`
                });
            }
            if (!(location in client_1.Location)) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: 'Localização inválida' });
            }
            if (!(course in client_1.Course)) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: 'Curso inválido' });
            }
            if (semester && !(semester in client_1.Semester)) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: 'Semestre inválido' });
            }
            let finalLocation = location;
            let finalCustomLocation = customLocation;
            if (category.name === types_1.FIXED_CATEGORIES.CURSO_ONLINE.name) {
                if (!duration || duration <= 0) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        error: 'Campo "duration" é obrigatório para eventos do tipo Curso Online e deve ser maior que 0.'
                    });
                }
                finalLocation = types_1.FIXED_CATEGORIES.CURSO_ONLINE.enforcedLocation;
                finalCustomLocation = types_1.FIXED_CATEGORIES.CURSO_ONLINE.customLocation;
            }
            const createEventService = new CreateEventService_1.CreateEventService();
            try {
                const result = yield createEventService.execute({
                    name,
                    categoryId,
                    course,
                    semester,
                    maxParticipants,
                    location: finalLocation,
                    customLocation: finalCustomLocation,
                    speakerName,
                    startDate: new Date(startDate),
                    startTime: new Date(startTime),
                    endTime: new Date(endTime),
                    description,
                    isRestricted,
                    duration
                });
                return res.status(http_status_codes_1.StatusCodes.CREATED).json(result);
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    return res.status(error.statusCode).json({ error: error.message });
                }
                return res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Erro interno ao criar evento' });
            }
        });
    }
}
exports.CreateEventController = CreateEventController;
