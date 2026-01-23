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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var app_module_1 = require("../src/app.module");
var typeorm_1 = require("typeorm");
var institucional_student_entity_1 = require("../src/auth/entities/institucional-student.entity");
var institucional_teacher_entity_1 = require("../src/auth/entities/institucional-teacher.entity");
var institucional_audit_entity_1 = require("../src/auth/entities/institucional-audit.entity");
function verifyInstitucionalData() {
    return __awaiter(this, void 0, void 0, function () {
        var app, dataSource, studentRepo, teacherRepo, auditRepo, students, invalidStudentEmails, studentIds, expectedStudentIds_1, correctStudentIds, teachers, invalidTeacherEmails, teacherIds, expectedTeacherIds_1, correctTeacherIds, auditLogs, _a, _b, _c, allStudentEmails, allTeacherEmails, allEmails, uniqueEmails, isVerificationSuccessful, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4, core_1.NestFactory.createApplicationContext(app_module_1.AppModule)];
                case 1:
                    app = _d.sent();
                    dataSource = app.get(typeorm_1.DataSource);
                    console.log('🔍 Iniciando verificación de datos institucionales...');
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 7, 8, 10]);
                    studentRepo = dataSource.getRepository(institucional_student_entity_1.InstitucionalStudent);
                    teacherRepo = dataSource.getRepository(institucional_teacher_entity_1.InstitucionalTeacher);
                    auditRepo = dataSource.getRepository(institucional_audit_entity_1.InstitucionalAudit);
                    return [4, studentRepo.find({ where: { isActive: true } })];
                case 3:
                    students = _d.sent();
                    console.log("\n\uD83D\uDCCA Total estudiantes encontrados: ".concat(students.length));
                    if (students.length === 0) {
                        console.log('❌ No se encontraron estudiantes activos');
                    }
                    else {
                        console.log('✅ Estudiantes verificados');
                        invalidStudentEmails = students.filter(function (s) { return !s.email.endsWith('@uce.edu.ec'); });
                        if (invalidStudentEmails.length > 0) {
                            console.log("\u274C ".concat(invalidStudentEmails.length, " estudiantes con email inv\u00E1lido (no @uce.edu.ec)"));
                        }
                        else {
                            console.log('✅ Todos los emails de estudiantes tienen formato @uce.edu.ec');
                        }
                        studentIds = students.map(function (s) { return s.studentId; }).sort();
                        expectedStudentIds_1 = Array.from({ length: students.length }, function (_, i) { return "STD-".concat(String(i + 1).padStart(3, '0')); });
                        correctStudentIds = studentIds.every(function (id, index) { return id === expectedStudentIds_1[index]; });
                        if (correctStudentIds) {
                            console.log('✅ IDs de estudiantes secuenciales y correctos');
                        }
                        else {
                            console.log('❌ IDs de estudiantes no secuenciales');
                        }
                    }
                    return [4, teacherRepo.find({ where: { isActive: true } })];
                case 4:
                    teachers = _d.sent();
                    console.log("\n\uD83D\uDCCA Total profesores encontrados: ".concat(teachers.length));
                    if (teachers.length === 0) {
                        console.log('❌ No se encontraron profesores activos');
                    }
                    else {
                        console.log('✅ Profesores verificados');
                        invalidTeacherEmails = teachers.filter(function (t) { return !t.email.endsWith('@uce.edu.ec'); });
                        if (invalidTeacherEmails.length > 0) {
                            console.log("\u274C ".concat(invalidTeacherEmails.length, " profesores con email inv\u00E1lido (no @uce.edu.ec)"));
                        }
                        else {
                            console.log('✅ Todos los emails de profesores tienen formato @uce.edu.ec');
                        }
                        teacherIds = teachers.map(function (t) { return t.teacherId; }).sort();
                        expectedTeacherIds_1 = Array.from({ length: teachers.length }, function (_, i) { return "DOC-".concat(String(i + 1).padStart(3, '0')); });
                        correctTeacherIds = teacherIds.every(function (id, index) { return id === expectedTeacherIds_1[index]; });
                        if (correctTeacherIds) {
                            console.log('✅ IDs de profesores secuenciales y correctos');
                        }
                        else {
                            console.log('❌ IDs de profesores no secuenciales');
                        }
                    }
                    return [4, auditRepo.find({
                            order: { createdAt: 'DESC' },
                            take: 5
                        })];
                case 5:
                    auditLogs = _d.sent();
                    _b = (_a = console).log;
                    _c = "\n\uD83D\uDCCA Total logs de auditor\u00EDa: ".concat;
                    return [4, auditRepo.count()];
                case 6:
                    _b.apply(_a, [_c.apply("\n\uD83D\uDCCA Total logs de auditor\u00EDa: ", [_d.sent()])]);
                    if (auditLogs.length > 0) {
                        console.log('✅ Logs de auditoría encontrados');
                        console.log('📋 Últimos 5 logs:');
                        auditLogs.forEach(function (log, index) {
                            console.log("".concat(index + 1, ". ").concat(log.action, " - ").concat(log.email, " (").concat(log.createdAt.toLocaleString(), ")"));
                        });
                    }
                    else {
                        console.log('ℹ️  No hay logs de auditoría');
                    }
                    allStudentEmails = students.map(function (s) { return s.email; });
                    allTeacherEmails = teachers.map(function (t) { return t.email; });
                    allEmails = __spreadArray(__spreadArray([], allStudentEmails, true), allTeacherEmails, true);
                    uniqueEmails = new Set(allEmails);
                    if (uniqueEmails.size !== allEmails.length) {
                        console.log('❌ Se encontraron emails duplicados');
                    }
                    else {
                        console.log('✅ No hay emails duplicados');
                    }
                    console.log('\n📋 RESUMEN DE VERIFICACIÓN:');
                    console.log("\uD83C\uDF93 Estudiantes: ".concat(students.length, " (esperado: 60)"));
                    console.log("\uD83D\uDC68\u200D\uD83C\uDFEB Profesores: ".concat(teachers.length, " (esperado: 10)"));
                    console.log("\uD83D\uDCE7 Total emails: ".concat(allEmails.length, " (esperado: 70)"));
                    console.log("\u2705 Formato @uce.edu.ec: ".concat(uniqueEmails.size === allEmails.length ? 'Correcto' : 'Error'));
                    isVerificationSuccessful = students.length === 60 &&
                        teachers.length === 10 &&
                        uniqueEmails.size === allEmails.length;
                    if (isVerificationSuccessful) {
                        console.log('\n🎉 VERIFICACIÓN COMPLETADA EXITOSAMENTE');
                        console.log('✅ Sistema institucional listo para uso');
                    }
                    else {
                        console.log('\n⚠️  VERIFICACIÓN COMPLETADA CON ERRORES');
                        console.log('❌ Revisar los problemas indicados arriba');
                    }
                    return [3, 10];
                case 7:
                    error_1 = _d.sent();
                    console.error('❌ Error durante la verificación:', error_1);
                    throw error_1;
                case 8: return [4, app.close()];
                case 9:
                    _d.sent();
                    return [7];
                case 10: return [2];
            }
        });
    });
}
verifyInstitucionalData().catch(console.error);
