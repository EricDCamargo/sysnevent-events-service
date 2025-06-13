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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEventController = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const CreateEventService_1 = require("../../services/event/CreateEventService");
class CreateEventController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, categoryId, course, semester, maxParticipants, location, customLocation, speakerName, startDate, startTime, endTime, description, isRestricted } = req.body;
            const missingFields = [];
            if (!name)
                missingFields.push('name');
            if (!categoryId)
                missingFields.push('categoryId');
            if (!course)
                missingFields.push('course');
            if (!maxParticipants && maxParticipants <= 0)
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
            const upperLocation = location.toUpperCase();
            if (!(upperLocation in client_1.Location)) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: 'Invalid location' });
            }
            const upperCourse = course.toUpperCase();
            if (!(upperCourse in client_1.Course)) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: 'Invalid course' });
            }
            const upperSemester = semester.toUpperCase();
            if (!(upperSemester in client_1.Semester)) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: 'Invalid semester' });
            }
            const createEventService = new CreateEventService_1.CreateEventService();
            try {
                const result = yield createEventService.execute({
                    name,
                    categoryId,
                    course,
                    semester,
                    maxParticipants,
                    location: client_1.Location[upperLocation],
                    customLocation,
                    speakerName,
                    startDate: new Date(startDate),
                    startTime: new Date(startTime),
                    endTime: new Date(endTime),
                    description,
                    isRestricted
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
