
/*  interfaccia per logSettFilaPosti  */


export interface LogSettFilaPostiInterface {

  id: number;  // è idLogistica
  stato: number;
  idLogistica: number;
  idSettore: number;
  idFila: number;
  postoStart: number;
  postoEnd: number;
  errorposti: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}

