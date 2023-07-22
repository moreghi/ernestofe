import { EventoPostoInterface } from '../interfaces/eventoposto';

export class EventoPosto implements EventoPostoInterface {

  id: number;
  token: string;
  keypren: string
  stato: number;
  idlogistica: number;
  idEvento: number;
  idSettore: number;
  idFila: number;
  idPosto: number;
  desposto: string;
  cognome: string;
  nome: string;
  cellulare: string;
  email: string;
  tipobiglietto: number;
  idbiglietto: number;
  datapre: string;
  dataconf: string;
  dataemi: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.token = '';
    this.keypren = '';
    this.stato = 0;
    this.idlogistica = 0;
    this.idEvento = 0;
    this.idSettore = 0;
    this.idFila = 0;
    this.desposto = '';
    this.cognome = '';
    this.nome = '';
    this.cellulare = '';
    this.email = '';
    this.tipobiglietto = 0;
    this.idbiglietto = 0;
    this.datapre = '';
    this.dataconf = '';
    this.dataemi = '';
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}






