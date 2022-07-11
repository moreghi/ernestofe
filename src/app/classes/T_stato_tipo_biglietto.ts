import { TstatotipobigliettoInterface } from '../interfaces/t_tipo_biglietto';


export class TstatoEvento implements TstatotipobigliettoInterface {

  id: number;
  d_stato_tipo_biglietto: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;


  constructor()  {

    this.id = 0;
    this.d_stato_tipo_biglietto = '';
    this.key_utenti_operation  = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }

}









