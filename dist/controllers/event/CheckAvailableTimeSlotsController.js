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
exports.CheckAvailableTimeSlotsController = void 0;
const CheckAvailableTimeSlotsService_1 = require("../../services/event/CheckAvailableTimeSlotsService");
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
class CheckAvailableTimeSlotsController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { location, date, ignoreEventId } = req.query;
            if (!location ||
                typeof location !== 'string' ||
                !date ||
                typeof date !== 'string') {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: 'Location and date are required' });
            }
            const upperLocation = location.toUpperCase();
            if (!(upperLocation in client_1.Location)) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: 'Invalid location' });
            }
            const service = new CheckAvailableTimeSlotsService_1.CheckAvailableTimeSlotsService();
            const result = yield service.execute(client_1.Location[upperLocation], date, ignoreEventId);
            return res.json(result);
        });
    }
}
exports.CheckAvailableTimeSlotsController = CheckAvailableTimeSlotsController;
