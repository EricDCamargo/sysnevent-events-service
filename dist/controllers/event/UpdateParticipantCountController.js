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
exports.UpdateParticipantCountController = void 0;
const http_status_codes_1 = require("http-status-codes");
const UpdateParticipantCountService_1 = require("../../services/event/UpdateParticipantCountService");
const AppError_1 = require("../../errors/AppError");
class UpdateParticipantCountController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventId, action } = req.body;
            if (!eventId || !['increment', 'decrement'].includes(action)) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    error: 'Required fields: eventId and action ("increment" or "decrement")'
                });
            }
            const service = new UpdateParticipantCountService_1.UpdateParticipantCountService();
            try {
                yield service.execute({ eventId, action });
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: `currentParticipants ${action}ed com sucesso`
                });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    return res.status(error.statusCode).json({ error: error.message });
                }
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    error: 'Erro ao atualizar currentParticipants'
                });
            }
        });
    }
}
exports.UpdateParticipantCountController = UpdateParticipantCountController;
