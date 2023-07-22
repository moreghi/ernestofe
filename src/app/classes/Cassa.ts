import { CassaInterface } from '../interfaces/cassa';

export class Cassa implements CassaInterface {

  id: number;
  idEvento: number;
  datacassa: string;
  stato: number;
  cassaIniziale: number;
  incassi: number;
  cassaFinale: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.idEvento = 0;
    this.datacassa = '';
    this.stato = 0;
    this.cassaIniziale = 0;
    this.incassi = 0;
    this.cassaFinale = 0;
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}

