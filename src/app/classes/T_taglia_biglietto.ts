import { TtagliabigliettoInterface } from '../interfaces/t_taglia_biglietto';


export class Ttagliabiglietto implements TtagliabigliettoInterface {


  id: number;
  idtipotaglia: number;
  d_taglia: string;
  stato: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;
  // relazioni
  d_stato_taglia_biglietto: string;

  constructor()  {

    this.id = 0;
    this.idtipotaglia = 0;
    this.d_taglia = '';
    this.stato = 0;
    this.key_utenti_operation  = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();
    // per relazioni
    this.d_stato_taglia_biglietto = '';

    }

}


