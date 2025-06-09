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
exports.ListEventsService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListEventsService {
    execute(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category, startDate, endDate } = filters;
            const where = {};
            if (category) {
                where.category = category;
            }
            if (startDate) {
                where.startDate = { gte: new Date(startDate) };
            }
            if (endDate) {
                where.startDate = where.startDate
                    ? Object.assign(Object.assign({}, where.startDate), { lte: new Date(endDate) }) : { lte: new Date(endDate) };
            }
            const events = yield prisma_1.default.event.findMany({
                where,
                orderBy: { startDate: 'asc' }
            });
            return {
                data: events,
                message: 'Lista de eventos obtidos com sucesso!'
            };
        });
    }
}
exports.ListEventsService = ListEventsService;
