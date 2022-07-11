import { EventosettfilapostiInterface } from '../interfaces/eventosettfilaposti';

export class Eventosettfilaposti implements EventosettfilapostiInterface {

  id: number;  // è idLogistica
  stato: number;
  idEvento: number;
  idLogistica: number;
  idSettore: number;
  idFila: number;
  postoStart: number;
  postoEnd: number;
  utilizzo: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.stato = 0;
    this.idEvento = 0;
    this.idLogistica = 0;
    this.idSettore = 0;
    this.idFila = 0;
    this.postoStart = 0;
    this.postoEnd = 0;
    this. utilizzo = '';
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}








