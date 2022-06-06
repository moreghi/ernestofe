import { TesseramentoInterface } from '../interfaces/tesseramento';

export class Tesseramento implements TesseramentoInterface {

  id: number;
  idSocio: number;
  idTessera: string;
  stato: number;
  anno: number;
  dataiscr: string;
  importo: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.idSocio = 0;
    this.idTessera = '';
    this.stato = 0;
    this.anno = 0;
    this.dataiscr = '';
    this.importo = 0;
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}
