/*  interfaccia per prenotazevento_master  */


export interface W_Prenotazevento_masterInterface  {

  id: number;
  descEvento: string;
  dataEvento: string;
  oraEvento: string;
  datapren: string;
  cognome: string;
  nome: string;
  telefono: string;
  email: string;
  token: string;
  importo: number;
  created_at: Date;
  updated_at: Date;
}
