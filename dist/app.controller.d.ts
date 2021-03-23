import { AppService } from './app.service';
interface Response {
    message: string;
}
interface CreatePaymentDTO {
    customer: string;
    billingType: string;
    value: number;
    dueDate: string;
    description?: string;
    externalReference?: string;
    discount?: {
        value: number;
        dueDateLimitDays: 0;
    };
    fine?: {
        value: number;
    };
    interest?: {
        value: number;
    };
    postalService: boolean;
}
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    create(createPayment: CreatePaymentDTO): Promise<Response>;
    listCustomer(): Promise<any>;
}
export {};
