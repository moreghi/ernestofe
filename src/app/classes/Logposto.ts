
import { LogPostoInterface } from '../interfaces/logposto';

export class LogPosto implements LogPostoInterface {

  id: number;
  stato: number;
  idLogistica: number;
  idSettore: number;
  idFila: number;
  idPosto: number;
  desposto: string;
  tokenposto: string;
  cognome: string;
  nome: string;
  cellulare: string;
  email: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.stato = 0;
    this.idLogistica = 0;
    this.idSettore = 0;
    this.idFila = 0;
    this.idPosto = 0;
    this.desposto = '';
    this.tokenposto = '';
    this.cognome = '';
    this.nome = '';
    this.cellulare = '';
    this.email = '';
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}

