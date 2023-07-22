import { WsettoriInterface } from '../interfaces/w_settori';

export class Wsettori implements WsettoriInterface {

  id: number;
  descrizione: string;
  stato: number; // '0= attivo 1=non attivo'
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor()  {

  this.id = 0;
  this.descrizione = '';
  this.stato = 0;
  this.key_utenti_operation = 0;
  this.created_at = new Date();
  this.updated_at = new Date();

  }

}
