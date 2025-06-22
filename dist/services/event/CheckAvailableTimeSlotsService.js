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
exports.CheckAvailableTimeSlotsService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const MIN_SLOT_MINUTES = Number(process.env.MIN_SLOT_MINUTES) || 20;
const DAY_START_HOUR = process.env.DAY_START_HOUR || '00:00';
const DAY_END_HOUR = process.env.DAY_END_HOUR || '23:59';
function toTimeString(date) {
    return date.toTimeString().slice(0, 5);
}
class CheckAvailableTimeSlotsService {
    execute(location, date, ignoreEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Search all events for the given location and date
            const events = yield prisma_1.default.event.findMany({
                where: Object.assign({ location, startDate: new Date(date) }, (ignoreEventId && { id: { not: ignoreEventId } })),
                select: {
                    startTime: true,
                    endTime: true
                },
                orderBy: { startTime: 'asc' }
            });
            // Defines the start and end of the working day
            const dayStart = new Date(`${date}T${DAY_START_HOUR}`);
            const dayEnd = new Date(`${date}T${DAY_END_HOUR}`);
            // Maps events to busy intervals (occupied time slots)
            const busyIntervals = events.map(e => ({
                start: e.startTime,
                end: e.endTime
            }));
            const allIntervals = [
                { start: dayStart, end: dayStart },
                ...busyIntervals,
                { start: dayEnd, end: dayEnd }
            ].sort((a, b) => a.start.getTime() - b.start.getTime());
            const availableSlots = [];
            // Iterates through all intervals to find available slots between them
            for (let i = 0; i < allIntervals.length - 1; i++) {
                const currentEnd = allIntervals[i].end;
                const nextStart = allIntervals[i + 1].start;
                const diff = (nextStart.getTime() - currentEnd.getTime()) / 60000;
                if (diff >= MIN_SLOT_MINUTES) {
                    availableSlots.push({
                        start: toTimeString(currentEnd),
                        end: toTimeString(nextStart)
                    });
                }
            }
            return {
                data: availableSlots,
                message: 'Lista de intervalos de tempo disponiveis'
            };
        });
    }
}
exports.CheckAvailableTimeSlotsService = CheckAvailableTimeSlotsService;
