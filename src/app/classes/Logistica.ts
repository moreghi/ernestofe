import { LogisticaInterface } from '../interfaces/logistica';

export class Logistica implements LogisticaInterface {

  id: number;
  stato: number;
  localita: string;
  luogo: string;
  photo: string;
  nposti: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;
   // campo derivato dalla relazione con tabella t_stato_manifestazione
  d_stato_logistica: string;

  constructor() {
    this.id = 0;
    this.stato = 0;
    this.localita = '';
    this.luogo = '';
    this.photo = '';
    this.nposti = 0;
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();
    //
    this.d_stato_logistica = '';

  }
}














