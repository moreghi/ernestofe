import { LogSettoreInterface } from '../interfaces/logsettore';

export class LogSettore implements LogSettoreInterface {

  id: number;
  stato: number;
  idLogistica: number;
  dsettore: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.stato = 0;
    this.idLogistica = 0;
    this.dsettore = '';
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}





