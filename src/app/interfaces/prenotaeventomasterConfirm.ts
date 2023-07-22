/*  interfaccia per prenotazeventomaster_Confirm  */


export interface PrenotazeventomasterConfirmInterface  {


  id: number;
  idEvento: number;
  descEvento: string;
  dataEvento: string;
  oraEvento: string;
  datapren: string;
  nSolleciti: number;
  cognome: string;
  nome: string;
  telefono: string;
  email: string;
  token: string;
  codpren: string;
  importo: number;
  iban: string;
  created_at: Date;
  updated_at: Date;
}
