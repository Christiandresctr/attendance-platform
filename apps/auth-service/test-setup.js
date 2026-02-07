"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const config_1 = require("@nestjs/config");
config_1.ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env.test',
});
jest.setTimeout(30000);
