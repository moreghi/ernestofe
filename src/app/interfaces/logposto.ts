
/*  interfaccia per logPosto  */


export interface LogPostoInterface {

  id: number;
  stato: number;
  idLogistica: number;
  idSettore: number;
  idFila: number;
  idPosto: number;
  desposto: string;
  tokenposto: string;
  cognome: string;
  nome: string;
  cellulare: string;
  email: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}

