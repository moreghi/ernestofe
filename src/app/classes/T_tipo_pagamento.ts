import { TtipopagamentoInterface } from '../interfaces/t_tipo_pagamento';


export class Ttipopagamento implements TtipopagamentoInterface {

  id: number;
  d_tipo_pagamento: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;


  constructor()  {

    this.id = 0;
    this.d_tipo_pagamento = '';
    this.key_utenti_operation  = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

    }

}





