import { BigliettoInterface } from '../interfaces/biglietto';

export class Biglietto implements BigliettoInterface {

  id: number;
  evento: number;
  idprenotazione: number;
  stato: number;
  tipo: number;
  numero: number;
  cognome: string;
  nome: string;
  email: string;
  cellulare: string;
  datapre: string;
  dataconf: string;
  dataemi: string;
  settore: number;
  fila: number;
  posto: number;
  modpag: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;


  constructor() {
    this.id = 0;
    this.evento = 0;
    this.idprenotazione = 0;
    this.stato = 0;
    this.tipo = 0;
    this.numero = 0;
    this.cognome = '';
    this.nome = '';
    this.email = '';
    this.cellulare = '';
    this.datapre = '';
    this.dataconf = '';
    this.dataemi = '';
    this.settore = 0;
    this.fila = 0;
    this.posto = 0;
    this.modpag = 0;
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}



