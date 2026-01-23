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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var app_module_1 = require("../src/app.module");
var typeorm_1 = require("typeorm");
var role_entity_1 = require("../src/auth/entities/role.entity");
var permission_entity_1 = require("../src/auth/entities/permission.entity");
function verifyRoles() {
    return __awaiter(this, void 0, void 0, function () {
        var app, dataSource, roles, permissions, permissionsByResource, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, core_1.NestFactory.createApplicationContext(app_module_1.AppModule)];
                case 1:
                    app = _a.sent();
                    dataSource = app.get(typeorm_1.DataSource);
                    console.log('🔍 Verificando roles y permisos creados...');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, 6, 8]);
                    return [4, dataSource.getRepository(role_entity_1.Role).find()];
                case 3:
                    roles = _a.sent();
                    console.log("\n\uD83D\uDCCB Total roles encontrados: ".concat(roles.length));
                    roles.forEach(function (role) {
                        console.log("\n\uD83D\uDD39 Rol: ".concat(role.name));
                        console.log("   Descripci\u00F3n: ".concat(role.description));
                        console.log("   Nivel: ".concat(role.level));
                        console.log("   Es sistema: ".concat(role.isSystem));
                        console.log("   Permisos: ".concat(role.permissions ? role.permissions.length : 0, " permisos"));
                        if (role.permissions && role.permissions.length > 0) {
                            console.log("   Lista: ".concat(role.permissions.join(', ')));
                        }
                    });
                    return [4, dataSource.getRepository(permission_entity_1.Permission).find()];
                case 4:
                    permissions = _a.sent();
                    console.log("\n\uD83D\uDCCB Total permisos encontrados: ".concat(permissions.length));
                    permissionsByResource = permissions.reduce(function (acc, perm) {
                        if (!acc[perm.resource])
                            acc[perm.resource] = [];
                        acc[perm.resource].push(perm.action);
                        return acc;
                    }, {});
                    Object.entries(permissionsByResource).forEach(function (_a) {
                        var resource = _a[0], actions = _a[1];
                        console.log("\n\uD83D\uDD38 ".concat(resource, ": ").concat(actions.join(', ')));
                    });
                    console.log('\n✅ Verificación completada exitosamente');
                    return [3, 8];
                case 5:
                    error_1 = _a.sent();
                    console.error('❌ Error durante la verificación:', error_1);
                    throw error_1;
                case 6: return [4, app.close()];
                case 7:
                    _a.sent();
                    return [7];
                case 8: return [2];
            }
        });
    });
}
verifyRoles().catch(console.error);
