import { W_PrenotazeventoInterface } from './../interfaces/w_prenotazevento';

export class W_Prenotazevento implements W_PrenotazeventoInterface {

  id: number;
  cognome: string;
  nome: string;
  scontabile: string;
  telefono: string;
  email: string;
  idevento: number;
  idlogistica: number;
  idTipoBiglietto: number;
  idPosto: number;
  datapren: string;
  persone: number;
  token: string;
  idstato: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
        this.id = 0;
        this.cognome = '';
        this.nome = '';
        this.scontabile = 'N';
        this.telefono = '';
        this.email = '';
        this.idevento = 0;
        this.idlogistica = 0;
        this.idTipoBiglietto = 0;
        this.idPosto = 0;
        this.datapren = '';
        this.persone = 0;
        this.token = '';
        this.idstato = 0;
        this.created_at = new Date();
        this.updated_at = new Date();

  }
}


