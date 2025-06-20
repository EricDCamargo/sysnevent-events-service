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
const cloudinaryUpload_1 = require("../../lib/cloudinaryUpload");
class CreateEventController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, categoryId, course, semester, maxParticipants, location, customLocation, speakerName, startDate, startTime, endTime, description, isRestricted, duration } = req.body;
            if (!req.files || Object.keys(req.files).length === 0) {
                throw new AppError_1.AppError('Nenhum arquivo de imagem foi enviado.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const file = req.files['file'];
            if (!file.mimetype.startsWith('image/')) {
                throw new AppError_1.AppError('Formato de arquivo inválido. Apenas imagens são permitidas.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const resultFile = yield (0, cloudinaryUpload_1.uploadToCloudinary)(file);
            const category = yield prisma_1.default.category.findUnique({
                where: { id: categoryId }
            });
            if (!category) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    error: 'Categoria informada é inválida'
                });
            }
            const fixedCursoOnline = yield prisma_1.default.category.findFirst({
                where: {
                    name: types_1.FIXED_CATEGORIES.CURSO_ONLINE.name
                }
            });
            const isCursoOnline = fixedCursoOnline && category.id === fixedCursoOnline.id;
            // Monta lista de campos obrigatórios
            const missingFields = [];
            if (!name)
                missingFields.push('name');
            if (!course)
                missingFields.push('course');
            if (!maxParticipants || maxParticipants <= 0)
                missingFields.push('maxParticipants');
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
            // Validação condicional de location
            if (!isCursoOnline && !location) {
                missingFields.push('location');
            }
            // Se location for OUTROS, customLocation vira obrigatório
            if (!isCursoOnline && location === 'OUTROS' && !customLocation) {
                missingFields.push('customLocation');
            }
            if (missingFields.length > 0) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    error: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`
                });
            }
            // Validação de enums
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
            if (!isCursoOnline && !(location in client_1.Location)) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: 'Localização inválida' });
            }
            // Parse de datas
            const parsedStartDate = new Date(startDate);
            const parsedStartTime = new Date(startTime);
            const parsedEndTime = new Date(endTime);
            if (isNaN(parsedStartDate.getTime()) ||
                isNaN(parsedStartTime.getTime()) ||
                isNaN(parsedEndTime.getTime())) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    error: 'startDate, startTime e endTime precisam ser DateTimes válidos'
                });
            }
            // Garantir que startTime e endTime estejam no mesmo dia que startDate
            const sameDay = (a, b) => a.getUTCFullYear() === b.getUTCFullYear() &&
                a.getUTCMonth() === b.getUTCMonth() &&
                a.getUTCDate() === b.getUTCDate();
            if (!sameDay(parsedStartTime, parsedStartDate) ||
                !sameDay(parsedEndTime, parsedStartDate)) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    error: 'startTime e endTime precisam estar no mesmo dia do startDate'
                });
            }
            // Regras específicas para Curso Online
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
            const parsedMaxParticipants = Number(maxParticipants);
            const parsedDuration = duration !== undefined ? Number(duration) : undefined;
            const parsedIsRestricted = isRestricted !== undefined
                ? isRestricted === 'true' || isRestricted === true
                : undefined;
            // Chamada ao Service
            const createEventService = new CreateEventService_1.CreateEventService();
            try {
                const result = yield createEventService.execute({
                    name,
                    categoryId,
                    course,
                    semester,
                    maxParticipants: parsedMaxParticipants,
                    location: finalLocation,
                    customLocation: finalCustomLocation,
                    speakerName,
                    startDate: parsedStartDate,
                    startTime: parsedStartTime,
                    endTime: parsedEndTime,
                    description,
                    isRestricted: parsedIsRestricted,
                    duration: parsedDuration,
                    banner: resultFile.url
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
