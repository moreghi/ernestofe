import { PrenotazeventomasterConfirmInterface } from '../interfaces/prenotaeventomasterConfirm';

export class PrenotazeventomasterConfirm implements PrenotazeventomasterConfirmInterface {


  id: number;
  idEvento: number;
  descEvento: string;
  dataEvento: string;
  oraEvento: string;
  datapren: string;
  nSolleciti: number;
  cognome: string;
  nome: string;
  telefono: string;
  email: string;
  token: string;
  codpren: string;
  importo: number;
  iban: string;
  created_at: Date;
  updated_at: Date;

  constructor() {

    this.id = 0;
    this.idEvento = 0;
    this.descEvento = '';
    this.dataEvento = '';
    this.oraEvento = '';
    this.datapren = '';
    this.nSolleciti = 0;
    this.cognome = '';
    this.nome = '';
    this.telefono = '';
    this.email = '';
    this.token = '';
    this.codpren = '';
    this.importo = 0;
    this.iban = '';
    this.created_at = new Date();
    this.updated_at = new Date();

}



}
