import { LogFilaInterface } from '../interfaces/logfila';

export class LogFila implements LogFilaInterface {

  id: number;
  stato: number;
  idLogistica: number;
  idSettore: number;
  dfila: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.stato = 0;
    this.idLogistica = 0;
    this.idSettore = 0;
    this.dfila = '';
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}




