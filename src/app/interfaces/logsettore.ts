
/*  interfaccia per logSettore  */


export interface LogSettoreInterface {

  id: number;
  stato: number;
  idLogistica: number;
  idSettore: number;
  dsettore: string;
  nfile: number;
  nposti: number;
  npostipren: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}

