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
exports.ListEventsController = void 0;
const ListEventsService_1 = require("../../services/event/ListEventsService");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
class ListEventsController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoryId, startDate, endDate } = req.query;
            const filters = {
                categoryId: categoryId,
                startDate: startDate,
                endDate: endDate
            };
            const lsitEventsService = new ListEventsService_1.ListEventsService();
            try {
                const events = yield lsitEventsService.execute(filters);
                return res.status(http_status_codes_1.StatusCodes.OK).json(events);
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    return res.status(error.statusCode).json({ error: error.message });
                }
                return res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Erro interno ao buscar detalhes do evento' });
            }
        });
    }
}
exports.ListEventsController = ListEventsController;
