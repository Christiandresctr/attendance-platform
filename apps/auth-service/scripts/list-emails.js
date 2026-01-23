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
function listAvailableEmails() {
    return __awaiter(this, void 0, void 0, function () {
        var app, dataSource, studentRepo, teacherRepo, students, teachers, allEmails_1, uniqueEmails, duplicates, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, core_1.NestFactory.createApplicationContext(app_module_1.AppModule)];
                case 1:
                    app = _a.sent();
                    dataSource = app.get(typeorm_1.DataSource);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, 6, 8]);
                    studentRepo = dataSource.getRepository(institucional_student_entity_1.InstitucionalStudent);
                    teacherRepo = dataSource.getRepository(institucional_teacher_entity_1.InstitucionalTeacher);
                    return [4, studentRepo.find({ where: { isActive: true } })];
                case 3:
                    students = _a.sent();
                    return [4, teacherRepo.find({ where: { isActive: true } })];
                case 4:
                    teachers = _a.sent();
                    allEmails_1 = __spreadArray(__spreadArray([], students.map(function (s) { return s.email; }), true), teachers.map(function (t) { return t.email; }), true);
                    uniqueEmails = __spreadArray([], new Set(allEmails_1), true);
                    duplicates = allEmails_1.filter(function (email, index) { return allEmails_1.indexOf(email) !== index; });
                    console.log('\n📧 Available emails for registration:');
                    console.log('=====================================');
                    console.log('\n🎓 Students (first 10):');
                    students.slice(0, 10).forEach(function (student, i) {
                        console.log("".concat(i + 1, ". ").concat(student.email, " - ").concat(student.name, " (").concat(student.studentId, ")"));
                    });
                    console.log('\n👨‍🏫 Teachers (all):');
                    teachers.forEach(function (teacher, i) {
                        console.log("".concat(i + 1, ". ").concat(teacher.email, " - ").concat(teacher.name, " (").concat(teacher.teacherId, ")"));
                    });
                    if (duplicates.length > 0) {
                        console.log('\n❌ Duplicate emails found:');
                        __spreadArray([], new Set(duplicates), true).forEach(function (email) {
                            console.log("- ".concat(email));
                        });
                    }
                    console.log("\n\uD83D\uDCCA Summary:");
                    console.log("Total students: ".concat(students.length));
                    console.log("Total teachers: ".concat(teachers.length));
                    console.log("Unique emails: ".concat(uniqueEmails.length));
                    console.log("Total emails (with duplicates): ".concat(allEmails_1.length));
                    return [3, 8];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    return [3, 8];
                case 6: return [4, app.close()];
                case 7:
                    _a.sent();
                    return [7];
                case 8: return [2];
            }
        });
    });
}
listAvailableEmails();
