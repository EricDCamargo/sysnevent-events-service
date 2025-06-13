"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIXED_CATEGORIES = exports.Role = void 0;
const client_1 = require("@prisma/client");
var Role;
(function (Role) {
    Role["DOCENT_ASSISTANT"] = "DOCENT_ASSISTANT";
    Role["COORDINATOR"] = "COORDINATOR";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
const FIXED_CATEGORIES = {
    CURSO_ONLINE: {
        name: 'Curso Online',
        enforcedLocation: client_1.Location.OUTROS,
        customLocation: 'EAD'
    }
};
exports.FIXED_CATEGORIES = FIXED_CATEGORIES;
