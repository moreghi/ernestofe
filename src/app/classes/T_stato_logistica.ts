import { TstatologisticaInterface } from '../interfaces/t_stato_logistica';


export class TstatoLogistica implements TstatologisticaInterface {

  id: number;
  d_stato_logistica: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor()  {

    this.id = 0;
    this.d_stato_logistica = '';
    this.key_utenti_operation  = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }

}

