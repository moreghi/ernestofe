import { TstatoeventoInterface } from '../interfaces/t_stato_evento';


export class TstatoEvento implements TstatoeventoInterface {

  id: number;
  d_stato_evento: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;
  constructor()  {

    this.id = 0;
    this.d_stato_evento = '';
    this.key_utenti_operation  = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }

}





