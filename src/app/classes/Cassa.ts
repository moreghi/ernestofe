import { CassaInterface } from '../interfaces/cassa';

export class Cassa implements CassaInterface {

  id: number;
  datacassa: string;
  stato: number;
  importo: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.datacassa = '';
    this.stato = 0;
    this.importo = 0;
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}

