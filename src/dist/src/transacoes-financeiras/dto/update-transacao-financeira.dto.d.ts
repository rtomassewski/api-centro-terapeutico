import { CreateTransacaoFinanceiraDto } from './create-transacao-financeira.dto';
declare const UpdateTransacaoFinanceiraDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateTransacaoFinanceiraDto>>;
export declare class UpdateTransacaoFinanceiraDto extends UpdateTransacaoFinanceiraDto_base {
    data_pagamento?: string;
}
export {};
