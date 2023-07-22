/*  interfaccia per prenotazevento  */


export interface PrenotazeventoInterface  {

  id: number;
  idstato: number;
  token: string;
  cognome: string;
  nome: string;
  datapren: string;
  telefono: string;
  email: string;
  persone: number;
  nSolleciti: number;
  idevento: number;
  idlogistica: number;
  idsettore: number;
  idfila: number;
  idposto: number;
  idtipobiglietto: number;
  idbiglietto: number;
  created_at: Date;
  updated_at: Date;

}
