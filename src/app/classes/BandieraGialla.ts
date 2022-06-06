import { BandieragiallaInterface } from '../interfaces/bandieragialla';

export class Bandieragialla implements BandieragiallaInterface {

  id: number;
  nomeAssociazione: string;
  anno: number;
  ultimaTessera: number;
  costoTessera: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.nomeAssociazione = '';
    this.anno = 0;
    this.ultimaTessera = 0;
    this.costoTessera = 0;
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}


