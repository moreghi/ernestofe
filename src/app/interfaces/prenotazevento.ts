/*  interfaccia per prenotazevento  */


export interface PrenotazeventoInterface  {

  id: number;
  cognome: string;
  nome: string;
  telefono: string;
  email: string;
  idevento: number;
  idlogistica: number;
  idsettore: number;
  idfila: number;
  idposto: number;
  idtipobiglietto: number;
  idbiglietto: number;
  datapren: string;
  persone: number;
  idstato: number;
  created_at: Date;
  updated_at: Date;

}


