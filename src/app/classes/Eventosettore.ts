import { EventoSettoreInterface } from '../interfaces/eventosettore';

export class EventoSettore implements EventoSettoreInterface {

  id: number;
  stato: number;
  idEvento: number;
  idLogistica: number;
  idSettore: number;
  dsettore: string;
  nfile: number;
  nposti: number;
  npostipren: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.stato = 0;
    this.idEvento = 0;
    this.idLogistica = 0;
    this.idSettore = 0;
    this.dsettore = '';
    this.nfile = 0;
    this.nposti = 0;
    this.npostipren = 0;
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}























