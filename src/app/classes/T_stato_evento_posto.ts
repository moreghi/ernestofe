import { TstatoeventopostoInterface } from '../interfaces/t_stato_evento_posto';


export class TstatoEventoposto implements TstatoeventopostoInterface {

  id: number;
  d_stato_evento_posto: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor()  {

    this.id = 0;
    this.d_stato_evento_posto = '';
    this.key_utenti_operation  = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }

}








