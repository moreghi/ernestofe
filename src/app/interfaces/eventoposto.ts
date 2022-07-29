
/*  interfaccia per eventoPosto  */


export interface EventoPostoInterface {

  id: number;
  keyuserpren: string;
  stato: number;
  idlogistica: number;
  idEvento: number;
  idSettore: number;
  idFila: number;
  idPosto: number;
  cognome: string;
  nome: string;
  cellulare: string;
  email: string;
  tipobiglietto: number;
  idbiglietto: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
