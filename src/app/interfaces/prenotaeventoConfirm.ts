/*  interfaccia per prenotazevento_Confirm  */


export interface PrenotazeventoConfirmInterface  {

  id: number;
  cognome: string;
  nome: string;
  telefono: string;
  email: string;
  password: string;
  idevento: number;
  idlogistica: number;
  idsettore: number;
  idfila: number;
  idposto: number;
  idtipobiglietto: number;
  datapren: string;
  persone: number;
  token: string;
  codpren: string;
  created_at: Date;
  updated_at: Date;

}
