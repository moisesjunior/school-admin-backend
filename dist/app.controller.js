"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const axios_1 = require("axios");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async create(createPayment) {
        const boletoCriado = await axios_1.default.post('https://www.asaas.com/api/v3/payments', createPayment, {
            headers: {
                access_token: '1ab5d322fb48da630d4ed766928dd5d1ace2fe33d506d04f59a09dfc26d6ca99',
            },
        });
        return {
            message: 'Boleto cadastrado com sucesso',
        };
    }
    async listCustomer() {
        try {
            const customers = await axios_1.default.get('https://www.asaas.com/api/v3/customers', {
                headers: {
                    access_token: process.env.ASAAS_API_KEY,
                },
            });
            console.log(customers.data);
            return customers.data;
        }
        catch (error) {
            console.log(error);
        }
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "create", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "listCustomer", null);
AppController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map