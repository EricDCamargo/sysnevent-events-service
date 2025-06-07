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
class ListEventsController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category, startDate, endDate } = req.query;
            const filters = {
                category: category,
                startDate: startDate,
                endDate: endDate
            };
            const service = new ListEventsService_1.ListEventsService();
            const events = yield service.execute(filters);
            return res.status(http_status_codes_1.StatusCodes.OK).json(events);
        });
    }
}
exports.ListEventsController = ListEventsController;
