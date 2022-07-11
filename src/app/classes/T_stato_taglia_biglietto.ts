import { TstatotagliabigliettoInterface } from '../interfaces/t_stato_taglia_biglietto';


export class Tstatotagliabiglietto implements TstatotagliabigliettoInterface {

  id: number;
  d_stato_taglia_biglietto: string;
  stato: Number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;


  constructor()  {

    this.id = 0;
    this.d_stato_taglia_biglietto = '';
    this.stato = 0;
    this.key_utenti_operation  = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }

}


