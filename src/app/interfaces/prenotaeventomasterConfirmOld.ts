/*  interfaccia per prenotazeventomaster_ConfirmOld  */


export interface PrenotazeventomasterConfirmOldInterface  {

  id: number;
  cognome: string;
  nome: string;
  telefono: string;
  email: string;
  idevento: number;
  devento: string;
  idlogistica: number;
  idsettore: number;
  idfila: number;
  idposto: number;
  idtipobiglietto: number;
  datapren: string;
  keyuserpren: string;
  token: string;
  codpren: string;
  created_at: Date;
  updated_at: Date;

}
