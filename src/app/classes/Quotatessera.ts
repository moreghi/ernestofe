import { QuotatesseraInterface } from '../interfaces/quotatessera';

export class Quotatessera implements QuotatesseraInterface {

  id: number;
  idbg: number;
  anno: number;
  importo: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;


  constructor() {
    this.id = 0;
    this.idbg = 0;
    this.anno = 0;
    this.importo = 0;
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}
























