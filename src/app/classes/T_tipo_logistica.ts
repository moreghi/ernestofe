import { TtipologisticaInterface } from '../interfaces/t_tipo_logistica';


export class Ttipologistica implements TtipologisticaInterface {

  id: number;
  d_tipo_logistica: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor()  {

    this.id = 0;
    this.d_tipo_logistica = '';
    this.key_utenti_operation  = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

    }

}













