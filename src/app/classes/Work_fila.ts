import { workFilaInterface } from '../interfaces/work_fila';

export class WorkFila implements workFilaInterface {

  id: number;
  stato: number;
  idLogistica: number;
  idSettore: number;
  dfila: string;
  nposti: number;
  nstart: number;
  nend: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.stato = 0;
    this.idLogistica = 0;
    this.idSettore = 0;
    this.dfila = '';
    this.nposti = 0;
    this.nstart = 0;
    this.nend = 0;
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}




