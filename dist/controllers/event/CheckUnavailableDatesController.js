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
exports.CheckUnavailableDatesController = void 0;
const CheckUnavailableDatesService_1 = require("../../services/event/CheckUnavailableDatesService");
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
class CheckUnavailableDatesController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { location, ignoreEventId } = req.query;
            if (!location || typeof location !== 'string') {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: 'Localização não informada ou inválida' });
            }
            const upperLocation = location.toUpperCase();
            if (!(upperLocation in client_1.Location)) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: 'Localização inválida' });
            }
            const service = new CheckUnavailableDatesService_1.CheckUnavailableDatesService();
            const result = yield service.execute(client_1.Location[upperLocation], ignoreEventId);
            return res.json(result);
        });
    }
}
exports.CheckUnavailableDatesController = CheckUnavailableDatesController;
