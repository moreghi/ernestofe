
/*  interfaccia per logFila  */


export interface LogFilaInterface {

  id: number;
  stato: number;
  idLogistica: number;
  idSettore: number;
  dfila: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
