import { PrenotazeventomasterConfirmInterface } from './../interfaces/prenotaeventomasterConfirm';

export class PrenotazeventomasterConfirm implements PrenotazeventomasterConfirmInterface {

  id: number;
  cognome: string;
  nome: string;
  telefono: string;
  email: string;
  idevento: number;
  devento: string;
  idlogistica: number;
  idsettore: number;
  idfila: number;
  idposto: number;
  idtipobiglietto: number;
  datapren: string;
  keyuserpren: string;
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
        this.idevento = 0;
        this.devento = '';
        this.idlogistica = 0;
        this.idsettore = 0;
        this.idfila = 0;
        this.idposto = 0;
        this.idtipobiglietto = 0;
        this.datapren = '';
        this.keyuserpren = '';
        this.token = '';
        this.codpren = '';
        this.created_at = new Date();
        this.updated_at = new Date();

  }
}


