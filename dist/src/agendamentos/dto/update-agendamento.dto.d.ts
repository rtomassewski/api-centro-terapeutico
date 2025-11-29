import { CreateAgendamentoDto } from './create-agendamento.dto';
export declare enum FormaPagamento {
    DINHEIRO = "DINHEIRO",
    CARTAO_CREDITO = "CARTAO_CREDITO",
    CARTAO_DEBITO = "CARTAO_DEBITO",
    PIX = "PIX",
    CONVENIO = "CONVENIO"
}
declare const UpdateAgendamentoDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateAgendamentoDto>>;
export declare class UpdateAgendamentoDto extends UpdateAgendamentoDto_base {
    pago?: boolean;
    forma_pagamento?: FormaPagamento;
    valor_pago?: number;
}
export {};
