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
var user_entity_1 = require("../src/auth/entities/user.entity");
var credential_entity_1 = require("../src/auth/entities/credential.entity");
var role_audit_entity_1 = require("../src/auth/entities/role-audit.entity");
var institucional_audit_entity_1 = require("../src/auth/entities/institucional-audit.entity");
function cleanExistingData() {
    return __awaiter(this, void 0, void 0, function () {
        var app, dataSource, userRepo, userCount, credRepo, credCount, roleAuditRepo, roleAuditCount, instAuditRepo, instAuditCount, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, core_1.NestFactory.createApplicationContext(app_module_1.AppModule)];
                case 1:
                    app = _a.sent();
                    dataSource = app.get(typeorm_1.DataSource);
                    console.log('🧹 Iniciando limpieza de datos existentes...');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 16, 17, 19]);
                    userRepo = dataSource.getRepository(user_entity_1.User);
                    return [4, userRepo.count()];
                case 3:
                    userCount = _a.sent();
                    if (!(userCount > 0)) return [3, 5];
                    return [4, userRepo.createQueryBuilder().delete().from(user_entity_1.User).execute()];
                case 4:
                    _a.sent();
                    console.log("\u2705 ".concat(userCount, " usuarios eliminados de la tabla users"));
                    return [3, 6];
                case 5:
                    console.log('ℹ️  No hay usuarios en la tabla users');
                    _a.label = 6;
                case 6:
                    credRepo = dataSource.getRepository(credential_entity_1.Credential);
                    return [4, credRepo.count()];
                case 7:
                    credCount = _a.sent();
                    if (!(credCount > 0)) return [3, 9];
                    return [4, credRepo.createQueryBuilder().delete().from(credential_entity_1.Credential).execute()];
                case 8:
                    _a.sent();
                    console.log("\u2705 ".concat(credCount, " credenciales eliminadas de la tabla credentials"));
                    return [3, 10];
                case 9:
                    console.log('ℹ️  No hay credenciales en la tabla credentials');
                    _a.label = 10;
                case 10:
                    roleAuditRepo = dataSource.getRepository(role_audit_entity_1.RoleAudit);
                    return [4, roleAuditRepo.count()];
                case 11:
                    roleAuditCount = _a.sent();
                    if (!(roleAuditCount > 0)) return [3, 13];
                    return [4, roleAuditRepo.createQueryBuilder().delete().from(role_audit_entity_1.RoleAudit).execute()];
                case 12:
                    _a.sent();
                    console.log("\u2705 ".concat(roleAuditCount, " registros eliminados de role_audit"));
                    return [3, 14];
                case 13:
                    console.log('ℹ️  No hay registros en role_audit');
                    _a.label = 14;
                case 14:
                    instAuditRepo = dataSource.getRepository(institucional_audit_entity_1.InstitucionalAudit);
                    return [4, instAuditRepo.count()];
                case 15:
                    instAuditCount = _a.sent();
                    console.log("\u2139\uFE0F  Se mantienen ".concat(instAuditCount, " registros en institucional_audit para historial"));
                    console.log('🎉 Limpieza completada exitosamente');
                    console.log('📊 Base de datos lista para nuevo sistema institucional');
                    return [3, 19];
                case 16:
                    error_1 = _a.sent();
                    console.error('❌ Error durante la limpieza:', error_1);
                    throw error_1;
                case 17: return [4, app.close()];
                case 18:
                    _a.sent();
                    return [7];
                case 19: return [2];
            }
        });
    });
}
cleanExistingData().catch(console.error);
