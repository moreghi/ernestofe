/*  interfaccia per prenotazione  */


export interface PrenotazioneInterface  {

  id: number;
  cognome: string;
  nome: string;
  telefono: string;
  idgiornata: number,
  datapren: Date;
  persone: number;
  email: string;
  idstato: number;
  created_at: Date;
  update_at: Date;
   // tabella correlata
  d_stato_prenotazione: string;
 }


