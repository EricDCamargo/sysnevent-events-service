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
exports.ListActiveBannersController = void 0;
const http_status_codes_1 = require("http-status-codes");
const ListActiveBannersService_1 = require("../../services/banner/ListActiveBannersService");
const AppError_1 = require("../../errors/AppError");
class ListActiveBannersController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new ListActiveBannersService_1.ListActiveBannersService();
            try {
                const result = yield service.execute();
                return res.status(http_status_codes_1.StatusCodes.OK).json(result);
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    return res.status(error.statusCode).json({ error: error.message });
                }
                return res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Erro interno ao listar banners ativos.' });
            }
        });
    }
}
exports.ListActiveBannersController = ListActiveBannersController;
