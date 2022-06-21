import { SocioSearchInterface } from '../interfaces/sociosearch';

export class SocioSearch implements SocioSearchInterface {

  id: number;
  d_search: string;
  stato: number;
  tessere: string;
  localita: number;
  operativo: string;
  sesso: string;
  email: string;
  cell: string;
  orderby: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.d_search = '';
    this.stato = 0;
    this.tessere = '';
    this.localita = 0;
    this.operativo = '';
    this.sesso = '';
    this.email = '';
    this.cell = '';
    this.orderby = '';
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}

