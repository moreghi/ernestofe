import { PrenotazioneInterface } from './../interfaces/prenotazione';

export class Prenotazione implements PrenotazioneInterface {

  id: number;
  cognome: string;
  nome: string;
  telefono: string;
  idgiornata: number;
  datapren: Date;
  persone: number;
  email: string;
  idstato: number;
  created_at: Date;
  update_at: Date;
   // tabella correlata
  d_stato_prenotazione: string;

  constructor() {

    this.id = 0;
    this.cognome = '';
    this.nome = '';
    this.telefono = '';
    this.idgiornata = 0;
    this.datapren = new Date();
    this.persone = 0;
    this.email = '';
    this.idstato = 0;
    this.created_at = new Date();
    this.update_at = new Date();
     // tabella correlata
    this.d_stato_prenotazione = '';

  }
}
