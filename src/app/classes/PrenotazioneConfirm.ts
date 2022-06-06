import { PrenotazioneConfirmInterface } from './../interfaces/prenotazioneConfirm';

export class PrenotazioneConfirm implements PrenotazioneConfirmInterface {

    id: number;
    cognome: string;
    nome: string;
    telefono: string;
    email: string;
    password: string;
    idgiornata: number;
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
    this.idgiornata = 0;
    this.datapren = '';
    this.persone = 0;
    this.token = '';
    this.codpren = '';
    this.created_at = new Date();
    this.updated_at = new Date();

  }
}
