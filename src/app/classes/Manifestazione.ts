import { ManifestazioneInterface } from './../interfaces/manifestazione';

export class Manifestazione implements ManifestazioneInterface {

  id: number;
  descManif: string;
  anno: number;
  dtInizio: string;
  dtFine: string;
  numUtentiTot: number;
  incassatoTot: number;
  noteManifestazione: string;
  stato: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;
  // campo derivato dalla relazione con tabella t_stato_manifestazione
  d_stato_manifestazione: string;

  constructor() {

    this.id = 0;
    this.descManif = '';
    this.anno = 0;
    this.dtInizio = '';
    this.dtFine = '';
    this.numUtentiTot = 0;
    this.incassatoTot = 0;
    this.noteManifestazione = '';
    this.stato = 0;
    this.created_at = new Date();
    this.updated_at = new Date();
     // tabella correlata
    this.d_stato_manifestazione = '';

  }
}

