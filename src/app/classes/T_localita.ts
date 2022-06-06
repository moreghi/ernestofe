import { TlocalitaInterface } from '../interfaces/t_localita';

export class Tlocalita implements TlocalitaInterface {


  id: number;
  d_localita: string;
  cap: string;
  pr: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.d_localita = '';
    this.cap = '';
    this.pr = '';
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}





