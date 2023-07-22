/*  interfaccia per locandina  */


export interface LocandinaInterface {

  id: number;
  stato: number;
  idManif: number;
  idEvento: number;
  photo: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
