import { PrenotazeventoInterface } from './../interfaces/prenotazevento';

export class Prenotazevento implements PrenotazeventoInterface {

  id: number;
  cognome: string;
  nome: string;
  telefono: string;
  email: string;
  idevento: number;
  idlogistica: number;
  idsettore: number;
  idfila: number;
  idposto: number;
  idtipobiglietto: number;
  idbiglietto: number;
  datapren: string;
  persone: number;
  idstato: number;
  created_at: Date;
  updated_at: Date;


  constructor() {
        this.id = 0;
        this.cognome = '';
        this.nome = '';
        this.telefono = '';
        this.email = '';
        this.idevento = 0;
        this.idlogistica = 0;
        this.idsettore = 0;
        this.idfila = 0;
        this.idposto = 0;
        this.idtipobiglietto = 0;
        this.idbiglietto = 0;
        this.datapren = '';
        this.persone = 0;
        this.idstato = 0;
        this.created_at = new Date();
        this.updated_at = new Date();

  }
}


