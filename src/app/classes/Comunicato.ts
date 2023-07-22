import { ComunicatoInterface } from '../interfaces/comunicato';

export class Comunicato implements ComunicatoInterface {

  id: number;
  titolo: string;
  stato: number;
  dataStart: string;
  dataEnd: string;
  dayValidity: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.titolo = '';
    this.stato = 0;
    this.dataStart = '';
    this.dataEnd = '';
    this.dayValidity = 0;
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}
























