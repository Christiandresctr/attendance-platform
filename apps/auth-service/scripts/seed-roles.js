"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var permission_entity_2 = require("../src/auth/entities/permission.entity");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var app, dataSource, permissions, _i, permissions_1, permData, existingPerm, permission, rolesDefinition, _a, rolesDefinition_1, roleData, existingRole, role, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, core_1.NestFactory.createApplicationContext(app_module_1.AppModule)];
                case 1:
                    app = _b.sent();
                    dataSource = app.get(typeorm_1.DataSource);
                    console.log('🌱 Inicializando roles y permisos...');
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 15, 16, 18]);
                    permissions = [
                        { name: 'user:create', resource: permission_entity_2.PermissionResource.USER, action: permission_entity_2.PermissionAction.CREATE, description: 'Crear usuarios' },
                        { name: 'user:read', resource: permission_entity_2.PermissionResource.USER, action: permission_entity_2.PermissionAction.READ, description: 'Leer información de usuarios' },
                        { name: 'user:update', resource: permission_entity_2.PermissionResource.USER, action: permission_entity_2.PermissionAction.UPDATE, description: 'Actualizar información de usuarios' },
                        { name: 'user:delete', resource: permission_entity_2.PermissionResource.USER, action: permission_entity_2.PermissionAction.DELETE, description: 'Eliminar usuarios' },
                        { name: 'role:create', resource: permission_entity_2.PermissionResource.ROLE, action: permission_entity_2.PermissionAction.CREATE, description: 'Crear roles' },
                        { name: 'role:read', resource: permission_entity_2.PermissionResource.ROLE, action: permission_entity_2.PermissionAction.READ, description: 'Leer información de roles' },
                        { name: 'role:update', resource: permission_entity_2.PermissionResource.ROLE, action: permission_entity_2.PermissionAction.UPDATE, description: 'Actualizar roles' },
                        { name: 'role:delete', resource: permission_entity_2.PermissionResource.ROLE, action: permission_entity_2.PermissionAction.DELETE, description: 'Eliminar roles' },
                        { name: 'attendance:create', resource: permission_entity_2.PermissionResource.ATTENDANCE, action: permission_entity_2.PermissionAction.CREATE, description: 'Registrar asistencia' },
                        { name: 'attendance:read', resource: permission_entity_2.PermissionResource.ATTENDANCE, action: permission_entity_2.PermissionAction.READ, description: 'Ver registros de asistencia' },
                        { name: 'attendance:update', resource: permission_entity_2.PermissionResource.ATTENDANCE, action: permission_entity_2.PermissionAction.UPDATE, description: 'Modificar registros de asistencia' },
                        { name: 'attendance:delete', resource: permission_entity_2.PermissionResource.ATTENDANCE, action: permission_entity_2.PermissionAction.DELETE, description: 'Eliminar registros de asistencia' },
                        { name: 'attendance:manage', resource: permission_entity_2.PermissionResource.ATTENDANCE, action: permission_entity_2.PermissionAction.MANAGE, description: 'Gestionar asistencia completa' },
                        { name: 'class:create', resource: permission_entity_2.PermissionResource.CLASS, action: permission_entity_2.PermissionAction.CREATE, description: 'Crear clases' },
                        { name: 'class:read', resource: permission_entity_2.PermissionResource.CLASS, action: permission_entity_2.PermissionAction.READ, description: 'Ver información de clases' },
                        { name: 'class:update', resource: permission_entity_2.PermissionResource.CLASS, action: permission_entity_2.PermissionAction.UPDATE, description: 'Actualizar clases' },
                        { name: 'class:delete', resource: permission_entity_2.PermissionResource.CLASS, action: permission_entity_2.PermissionAction.DELETE, description: 'Eliminar clases' },
                        { name: 'schedule:create', resource: permission_entity_2.PermissionResource.SCHEDULE, action: permission_entity_2.PermissionAction.CREATE, description: 'Crear horarios' },
                        { name: 'schedule:read', resource: permission_entity_2.PermissionResource.SCHEDULE, action: permission_entity_2.PermissionAction.READ, description: 'Ver horarios' },
                        { name: 'schedule:update', resource: permission_entity_2.PermissionResource.SCHEDULE, action: permission_entity_2.PermissionAction.UPDATE, description: 'Actualizar horarios' },
                        { name: 'schedule:delete', resource: permission_entity_2.PermissionResource.SCHEDULE, action: permission_entity_2.PermissionAction.DELETE, description: 'Eliminar horarios' },
                        { name: 'report:create', resource: permission_entity_2.PermissionResource.REPORT, action: permission_entity_2.PermissionAction.CREATE, description: 'Generar reportes' },
                        { name: 'report:read', resource: permission_entity_2.PermissionResource.REPORT, action: permission_entity_2.PermissionAction.READ, description: 'Ver reportes' },
                    ];
                    _i = 0, permissions_1 = permissions;
                    _b.label = 3;
                case 3:
                    if (!(_i < permissions_1.length)) return [3, 8];
                    permData = permissions_1[_i];
                    return [4, dataSource.getRepository(permission_entity_1.Permission).findOne({
                            where: { name: permData.name }
                        })];
                case 4:
                    existingPerm = _b.sent();
                    if (!!existingPerm) return [3, 6];
                    permission = dataSource.getRepository(permission_entity_1.Permission).create(permData);
                    return [4, dataSource.getRepository(permission_entity_1.Permission).save(permission)];
                case 5:
                    _b.sent();
                    console.log("\u2705 Permiso creado: ".concat(permData.name));
                    return [3, 7];
                case 6:
                    console.log("\u2139\uFE0F  Permiso ya existe: ".concat(permData.name));
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3, 3];
                case 8:
                    rolesDefinition = [
                        {
                            name: 'estudiante',
                            description: 'Estudiante del sistema',
                            level: 30,
                            isSystem: true,
                            permissions: [
                                'attendance:read',
                                'class:read',
                                'schedule:read',
                                'report:read',
                                'user:read'
                            ]
                        },
                        {
                            name: 'profesor',
                            description: 'Profesor del sistema',
                            level: 20,
                            isSystem: true,
                            permissions: [
                                'attendance:create',
                                'attendance:read',
                                'attendance:update',
                                'class:read',
                                'schedule:read',
                                'report:create',
                                'report:read',
                                'user:read',
                                'user:update'
                            ]
                        },
                        {
                            name: 'administrador',
                            description: 'Administrador del sistema',
                            level: 10,
                            isSystem: true,
                            permissions: [
                                'user:create',
                                'user:read',
                                'user:update',
                                'user:delete',
                                'role:create',
                                'role:read',
                                'role:update',
                                'role:delete',
                                'attendance:create',
                                'attendance:read',
                                'attendance:update',
                                'attendance:delete',
                                'attendance:manage',
                                'class:create',
                                'class:read',
                                'class:update',
                                'class:delete',
                                'schedule:create',
                                'schedule:read',
                                'schedule:update',
                                'schedule:delete',
                                'report:create',
                                'report:read'
                            ]
                        }
                    ];
                    _a = 0, rolesDefinition_1 = rolesDefinition;
                    _b.label = 9;
                case 9:
                    if (!(_a < rolesDefinition_1.length)) return [3, 14];
                    roleData = rolesDefinition_1[_a];
                    return [4, dataSource.getRepository(role_entity_1.Role).findOne({
                            where: { name: roleData.name }
                        })];
                case 10:
                    existingRole = _b.sent();
                    if (!!existingRole) return [3, 12];
                    role = dataSource.getRepository(role_entity_1.Role).create(__assign(__assign({}, roleData), { permissions: roleData.permissions }));
                    return [4, dataSource.getRepository(role_entity_1.Role).save(role)];
                case 11:
                    _b.sent();
                    console.log("\u2705 Rol creado: ".concat(roleData.name, " con ").concat(roleData.permissions.length, " permisos"));
                    return [3, 13];
                case 12:
                    console.log("\u2139\uFE0F  Rol ya existe: ".concat(roleData.name));
                    _b.label = 13;
                case 13:
                    _a++;
                    return [3, 9];
                case 14:
                    console.log('🎉 Inicialización de roles y permisos completada exitosamente');
                    return [3, 18];
                case 15:
                    error_1 = _b.sent();
                    console.error('❌ Error durante la inicialización:', error_1);
                    throw error_1;
                case 16: return [4, app.close()];
                case 17:
                    _b.sent();
                    return [7];
                case 18: return [2];
            }
        });
    });
}
bootstrap().catch(console.error);
