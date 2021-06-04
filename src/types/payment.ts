export interface FindPayments {
  type?: PaymentsType;
  status?: PaymentsStatus;
  customer?: string;
}

export type PaymentsType =
  | 'Mensalidade'
  | 'Dependência'
  | 'Matrícula'
  | 'Falta (Estágio)'
  | 'Outros';

export const paymentStatusFromEvents = {
  PAYMENT_CREATED: 'PENDING',
  PAYMENT_UPDATED: 'PENDING',
  PAYMENT_CONFIRMED: 'CONFIRMED',
  PAYMENT_RECEIVED: 'RECEIVED',
  PAYMENT_OVERDUE: 'OVERDUE',
  PAYMENT_DELETED: 'DELETED',
  PAYMENT_RESTORED: 'RESTORED',
  PAYMENT_REFUNDED: 'REFUNDED',
  PAYMENT_RECEIVED_IN_CASH_UNDONE: 'RECEIVED_IN_CASH_UNDONE',
  PAYMENT_CHARGEBACK_REQUESTED: 'CHARGEBACK_REQUESTED',
  PAYMENT_CHARGEBACK_DISPUTE: 'CHARGEBACK_DISPUTE',
  PAYMENT_AWAITING_CHARGEBACK_REVERSAL: 'AWAITING_CHARGEBACK_REVERSAL',
  PAYMENT_DUNNING_RECEIVED: 'DUNNING_RECEIVED',
  PAYMENT_DUNNING_REQUESTED: 'DUNNING_REQUESTED',
};

export interface ReceivePayment {
  event:
    | 'PAYMENT_CREATED'
    | 'PAYMENT_UPDATED'
    | 'PAYMENT_CONFIRMED'
    | 'PAYMENT_RECEIVED'
    | 'PAYMENT_OVERDUE'
    | 'PAYMENT_DELETED'
    | 'PAYMENT_RESTORED'
    | 'PAYMENT_REFUNDED'
    | 'PAYMENT_RECEIVED_IN_CASH_UNDONE'
    | 'PAYMENT_CHARGEBACK_REQUESTED'
    | 'PAYMENT_CHARGEBACK_DISPUTE'
    | 'PAYMENT_AWAITING_CHARGEBACK_REVERSAL';
  payment: {
    object: string;
    id: string;
    dateCreated: string;
    customer: string;
    subscription: string;
    installment: string;
    paymentLink: string;
    dueDate: string;
    value: number;
    netValue: number;
    billingType: string;
    status: string;
    description: string;
    externalReference: string;
    confirmedDate: string;
    originalValue: number | null;
    interestValue: number | null;
    originalDueDate: string;
    paymentDate: string | null;
    clientPaymentDate: string | null;
    invoiceUrl: string;
    bankSlipUrl: null;
    invoiceNumber: string;
    deleted: boolean;
    creditCard: {
      creditCardNumber: string;
      creditCardBrand: string;
      creditCardToken: string;
    };
  };
}

export interface ReceiveInCash {
  paymentDate: string;
  value: string;
  notifyCustomer: boolean;
}

export type PaymentsStatus =
  | 'PENDING'
  | 'DELETED'
  | 'RESTORED'
  | 'CONFIRMED'
  | 'RECEIVED'
  | 'RECEIVED_IN_CASH'
  | 'RECEIVED_IN_CASH_UNDONE'
  | 'OVERDUE'
  | 'REFUND_REQUESTED'
  | 'REFUNDED'
  | 'CHARGEBACK_REQUESTED'
  | 'CHARGEBACK_DISPUTE'
  | 'AWAITING_CHARGEBACK_REVERSAL'
  | 'DUNNING_REQUESTED'
  | 'DUNNING_RECEIVED'
  | 'AWAITING_RISK_ANALYSIS'
  | 'LOCAL';
