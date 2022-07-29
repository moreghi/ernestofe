import { PrenotazeventoConfirmInterface } from './../interfaces/prenotaeventoConfirm';

export class PrenotazeventoConfirm implements PrenotazeventoConfirmInterface {

  id: number;
  cognome: string;
  nome: string;
  telefono: string;
  email: string;
  password: string;
  idevento: number;
  idlogistica: number;
  idsettore: number;
  idfila: number;
  idposto: number;
  idtipobiglietto: number;
  datapren: string;
  persone: number;
  token: string;
  codpren: string;
  created_at: Date;
  updated_at: Date;


  constructor() {
        this.id = 0;
        this.cognome = '';
        this.nome = '';
        this.telefono = '';
        this.email = '';
        this.password = '';
        this.idevento = 0;
        this.idlogistica = 0;
        this.idsettore = 0;
        this.idfila = 0;
        this.idposto = 0;
        this.idtipobiglietto = 0;
        this.datapren = '';
        this.persone = 0;
        this.token = '';
        this.codpren = '';
        this.created_at = new Date();
        this.updated_at = new Date();

  }
}


