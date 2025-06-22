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
exports.CheckUnavailableDatesService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const MIN_SLOT_MINUTES = Number(process.env.MIN_SLOT_MINUTES) || 20;
const DAY_START_HOUR = process.env.DAY_START_HOUR || '00:00';
const DAY_END_HOUR = process.env.DAY_END_HOUR || '23:59';
class CheckUnavailableDatesService {
    execute(location, ignoreEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Search all events for the given location and date
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const events = yield prisma_1.default.event.findMany({
                where: Object.assign({ location, startDate: { gte: today } }, (ignoreEventId && { id: { not: ignoreEventId } })),
                select: {
                    startDate: true,
                    startTime: true,
                    endTime: true
                }
            });
            // Group events by day
            const eventsByDay = {};
            for (const event of events) {
                const dayKey = event.startDate.toISOString().split('T')[0];
                if (!eventsByDay[dayKey])
                    eventsByDay[dayKey] = [];
                eventsByDay[dayKey].push({ start: event.startTime, end: event.endTime });
            }
            const unavailableDays = [];
            // For each day, check if there is any available slot
            for (const [day, intervals] of Object.entries(eventsByDay)) {
                const dayStart = new Date(`${day}T${DAY_START_HOUR}`);
                const dayEnd = new Date(`${day}T${DAY_END_HOUR}`);
                // Sort intervals by start time
                const sorted = intervals.sort((a, b) => a.start.getTime() - b.start.getTime());
                let lastEnd = dayStart;
                let hasSlot = false;
                // Check for available slots between events
                for (const interval of sorted) {
                    const diff = (interval.start.getTime() - lastEnd.getTime()) / 60000;
                    // If there is a slot greater than or equal to the minimum, mark as available
                    if (diff >= MIN_SLOT_MINUTES) {
                        hasSlot = true;
                        break;
                    }
                    // Update lastEnd to the end of the current interval if it is later
                    if (interval.end > lastEnd)
                        lastEnd = interval.end;
                }
                // Check for available slot after the last event until the end of the day
                const diffEnd = (dayEnd.getTime() - lastEnd.getTime()) / 60000;
                if (diffEnd >= MIN_SLOT_MINUTES)
                    hasSlot = true;
                // If no slot is available, add the day to the unavailable list
                if (!hasSlot)
                    unavailableDays.push(day);
            }
            return { data: unavailableDays, message: 'Lista de datas indisponiveis' };
        });
    }
}
exports.CheckUnavailableDatesService = CheckUnavailableDatesService;
