/* interfaccia tabella eventos  */

export interface EventoInterface {

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
  d_logistica: string;   // vecchio da eliminare
  photo: string;         // vecchio da eliminare
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

}



