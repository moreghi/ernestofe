import { BandieragiallaInterface } from '../interfaces/bandieragialla';

export class Bandieragialla implements BandieragiallaInterface {

  id: number;
  nomeassociazione: string;
  email: string;
  indirizzo: string;
  telefono: string;
  cellulare: string;
  codfisc: string;
  piva: string;
  iban: string;
  banca: string;
  ultimaTessera: number;
  costoTessera: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;


  constructor() {
    this.id = 0;
    this.nomeassociazione = '';
    this.email = '';
    this.indirizzo = '';
    this.telefono = '';
    this.cellulare = '';
    this.codfisc = '';
    this.piva = '';
    this.iban = '';
    this.banca = '';
    this.ultimaTessera = 0;
    this.costoTessera = 0;
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}


