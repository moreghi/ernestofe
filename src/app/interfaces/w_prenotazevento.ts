/*  interfaccia per prenotazevento  */


export interface W_PrenotazeventoInterface  {

  id: number;
  cognome: string;
  nome: string;
  scontabile: string;
  telefono: string;
  email: string;
  idevento: number;
  idlogistica: number;
  idPosto: number;
  idTipoBiglietto: number;
  datapren: string;
  persone: number;
  token: string;
  idstato: number;
  created_at: Date;
  updated_at: Date;
}

