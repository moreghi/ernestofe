import { CassamovInterface } from '../interfaces/cassamov';

export class Cassamov implements CassamovInterface {

  id: number;
  idcassa: number;
  idevento: number;
  idbiglietto: number;
  importo: number;
  stato: number;
  modpag: number;
  cognome: string;
  nome: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.idcassa = 0;
    this.idevento = 0;
    this.idbiglietto = 0;
    this.importo = 0;
    this.stato = 0;
    this.modpag = 0;
    this.cognome = '';
    this.nome = '';
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}











