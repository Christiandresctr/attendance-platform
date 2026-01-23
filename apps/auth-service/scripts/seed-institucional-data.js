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
var institucional_student_entity_1 = require("../src/auth/entities/institucional-student.entity");
var institucional_teacher_entity_1 = require("../src/auth/entities/institucional-teacher.entity");
function generateInstitucionalEmail(fullName, lastName) {
    var nameParts = fullName.split(' ');
    var firstInitial = nameParts[0][0].toLowerCase();
    var secondInitial = nameParts.length > 1 ? nameParts[1][0].toLowerCase() : '';
    var lastNameMain = lastName.split(' ')[0].toLowerCase();
    return "".concat(firstInitial).concat(secondInitial).concat(lastNameMain, "@uce.edu.ec");
}
function generateRandomDate(daysAgo) {
    if (daysAgo === void 0) { daysAgo = 30; }
    var date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    return date;
}
function generateRandomCedula(base) {
    return "171234567".concat(base);
}
function seedInstitucionalData() {
    return __awaiter(this, void 0, void 0, function () {
        var app, dataSource, studentFirstNames, studentLastNames, teacherFirstNames, teacherLastNames, studentRepo, teacherRepo, studentsCreados, i, firstName, lastName, email, studentId, student, error_1, teachersCreados, i, firstName, lastName, email, teacherId, teacher, error_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, core_1.NestFactory.createApplicationContext(app_module_1.AppModule)];
                case 1:
                    app = _a.sent();
                    dataSource = app.get(typeorm_1.DataSource);
                    console.log('🌱 Iniciando generación de datos institucionales...');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 17, 18, 20]);
                    studentFirstNames = [
                        'Christian Andres', 'Maria Isabel', 'Luis Fernando', 'Ana Maria', 'Carlos Alberto',
                        'Patricia Alexandra', 'Diego Andres', 'Gabriela Maria', 'Roberto Andres', 'Catherine Alexandra',
                        'Eduardo Jose', 'Sofia Carolina', 'Andres Felipe', 'Valeria Alejandra', 'Nicolas Mauricio',
                        'Daniela Beatriz', 'Sebastian David', 'Camila Andrea', 'Javier Ignacio', 'Lucia Victoria',
                        'Martín Gabriel', 'Paulina Daniela', 'Ricardo Antonio', 'Isabella Fernanda', 'Mateo Sebastian',
                        'Victoria Eugenia', 'Felipe Andres', 'Rebecca Sophia', 'Lucas Alejandro', 'Emilia Valentina',
                        'Bruno Benjamin', 'Olivia Isabella', 'Leonardo Santiago', 'Emma Grace', 'Alexander Thomas',
                        'Sophia Marie', 'Daniel James', 'Mia Rose', 'Ethan Michael', 'Charlotte Grace',
                        'William John', 'Amelia Jane', 'James Robert', 'Harper Lee', 'Benjamin Joseph',
                        'Evelyn Claire', 'Lucas Henry', 'Isabella Fernanda', 'Alexander Thomas', 'Sophia Marie',
                        'Emma Grace', 'William John', 'Amelia Jane', 'Isabella Fernanda'
                    ];
                    studentLastNames = [
                        'Maisincho', 'Martinez', 'Rojas', 'Torres', 'Flores', 'Mendoza', 'Perez', 'Sanchez',
                        'Vargas', 'Morales', 'Castro', 'Reyes', 'Molina', 'Gonzalez', 'Ruiz', 'Lopez',
                        'Silva', 'Campos', 'Soto', 'Marin', 'Diaz', 'Fuentes', 'Cortes', 'Alvarez',
                        'Romero', 'Gutierrez', 'Herrera', 'Mendoza', 'Gil', 'Santos', 'Cruz', 'Navarro',
                        'Jimenez', 'Muñoz', 'Dominguez', 'Ortega', 'Rubio', 'Iglesias', 'Ferrer', 'Cabrera'
                    ];
                    teacherFirstNames = [
                        'Roberto Dario', 'Maria Cristina', 'Jose Andres', 'Patricia Elizabeth', 'Carlos Alberto',
                        'Luis Fernando', 'Ana Gabriela', 'Diego Alejandro', 'Roberto Carlos', 'Catherine Maria'
                    ];
                    teacherLastNames = [
                        'Martinez Noguera', 'Perez Alvarez', 'Sanchez Mora', 'Vargas Lopez', 'Mendoza Salas',
                        'Rojas Torres', 'Torres Flores', 'Morales Castro', 'Perez Mendez', 'Flores Sanchez'
                    ];
                    studentRepo = dataSource.getRepository(institucional_student_entity_1.InstitucionalStudent);
                    teacherRepo = dataSource.getRepository(institucional_teacher_entity_1.InstitucionalTeacher);
                    return [4, studentRepo.createQueryBuilder().delete().from(institucional_student_entity_1.InstitucionalStudent).execute()];
                case 3:
                    _a.sent();
                    return [4, teacherRepo.createQueryBuilder().delete().from(institucional_teacher_entity_1.InstitucionalTeacher).execute()];
                case 4:
                    _a.sent();
                    console.log('🧹 Datos institucionales existentes eliminados');
                    console.log('👨‍🎓 Generando 60 estudiantes...');
                    studentsCreados = 0;
                    i = 0;
                    _a.label = 5;
                case 5:
                    if (!(i < 60)) return [3, 10];
                    firstName = studentFirstNames[i % studentFirstNames.length];
                    lastName = studentLastNames[i % studentLastNames.length];
                    email = generateInstitucionalEmail(firstName, lastName);
                    studentId = "STD-".concat(String(i + 1).padStart(3, '0'));
                    student = studentRepo.create({
                        email: email,
                        name: "".concat(firstName, " ").concat(lastName),
                        studentId: studentId,
                        identification: generateRandomCedula(i + 1),
                        faculty: 'Facultad de Ingeniería y Ciencias Exactas',
                        career: 'Ingeniería en Sistemas',
                        isActive: true,
                        createdAt: generateRandomDate(30)
                    });
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4, studentRepo.save(student)];
                case 7:
                    _a.sent();
                    studentsCreados++;
                    console.log("\u2705 Estudiante ".concat(i + 1, "/60: ").concat(student.email, " (").concat(student.studentId, ")"));
                    return [3, 9];
                case 8:
                    error_1 = _a.sent();
                    console.log("\u274C Error al crear estudiante ".concat(i + 1, ":"), error_1.message);
                    return [3, 9];
                case 9:
                    i++;
                    return [3, 5];
                case 10:
                    console.log('👨‍🏫 Generando 10 profesores...');
                    teachersCreados = 0;
                    i = 0;
                    _a.label = 11;
                case 11:
                    if (!(i < 10)) return [3, 16];
                    firstName = teacherFirstNames[i];
                    lastName = teacherLastNames[i];
                    email = generateInstitucionalEmail(firstName, lastName);
                    teacherId = "DOC-".concat(String(i + 1).padStart(3, '0'));
                    teacher = teacherRepo.create({
                        email: email,
                        name: "".concat(firstName, " ").concat(lastName),
                        teacherId: teacherId,
                        identification: generateRandomCedula(i + 100),
                        faculty: 'Facultad de Ingeniería y Ciencias Exactas',
                        department: 'Departamento de Ingeniería en Sistemas',
                        isActive: true,
                        createdAt: generateRandomDate(30)
                    });
                    _a.label = 12;
                case 12:
                    _a.trys.push([12, 14, , 15]);
                    return [4, teacherRepo.save(teacher)];
                case 13:
                    _a.sent();
                    teachersCreados++;
                    console.log("\u2705 Profesor ".concat(i + 1, "/10: ").concat(teacher.email, " (").concat(teacher.teacherId, ")"));
                    return [3, 15];
                case 14:
                    error_2 = _a.sent();
                    console.log("\u274C Error al crear profesor ".concat(i + 1, ":"), error_2.message);
                    return [3, 15];
                case 15:
                    i++;
                    return [3, 11];
                case 16:
                    console.log('\n📋 Ejemplos de estudiantes generados:');
                    console.log('\n🎉 Generación de datos institucionales completada exitosamente');
                    console.log('📊 Total: 60 estudiantes + 10 profesores');
                    console.log('🏛️  Facultad: Facultad de Ingeniería y Ciencias Exactas');
                    console.log('🎓 Carrera: Ingeniería en Sistemas');
                    return [3, 20];
                case 17:
                    error_3 = _a.sent();
                    console.error('❌ Error durante la generación de datos:', error_3);
                    throw error_3;
                case 18: return [4, app.close()];
                case 19:
                    _a.sent();
                    return [7];
                case 20: return [2];
            }
        });
    });
}
seedInstitucionalData().catch(console.error);
