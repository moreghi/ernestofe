import { EventoInterface } from '../interfaces/evento';

export class Evento implements EventoInterface {

  id: number;
  descrizione: string;
  descbreve: string;
  idmanif: number;
  stato: number;
  statobiglietti: number;
  statoposti: number;
  data: string;
  ora: string;
  localita: string;
  indirizzo: string;
  cap: string;
  idtipo: number;
  tipobiglietto: number;
  idlogistica: number;
  d_logistica: string;      //  vecchio da eliminare
  photo: string;            //  vecchio da eliminare
  locandina: number;
  nposti: number;
  npostiDisponibili: number;
  npostiAssegnati: number;
  npostipren: number;
  incassato: number;
  spese: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;
  // da relazioni
  d_stato_evento: string;
  d_stato_evento_biglietto: string;
  d_stato_evento_posto: string;

  constructor() {
    this.id = 0;
    this.descrizione = '';
    this.descbreve = '';
    this.idmanif = 0;
    this.stato = 0;
    this.statobiglietti = 0;
    this.statoposti = 0;
    this.data = '';
    this.ora = '';
    this.localita = '';
    this.indirizzo = '';
    this.cap = '';
    this.idtipo = 0;
    this.tipobiglietto = 0;
    this.idlogistica = 0;
    this.d_logistica = '';    // vecchio da eliminare
    this.photo = '';          // vecchio da eliminare
    this.locandina = 0;
    this.nposti = 0;
    this.npostiDisponibili = 0;
    this.npostiAssegnati = 0;
    this.npostipren = 0;
    this.incassato = 0;
    this.spese = 0;
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();
    // da relazioni
    this.d_stato_evento = '';
    this.d_stato_evento_biglietto = '';
    this.d_stato_evento_posto = '';
  }
}









