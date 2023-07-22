
/*  interfaccia per eventoPosto  */


export interface EventoPostoInterface {

  id: number;
  token: string;
  keypren: string
  stato: number;
  idlogistica: number;
  idEvento: number;
  idSettore: number;
  idFila: number;
  idPosto: number;
  desposto: string;
  cognome: string;
  nome: string;
  cellulare: string;
  email: string;
  tipobiglietto: number;
  idbiglietto: number;
  datapre: string;
  dataconf: string;
  dataemi: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
