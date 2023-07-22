import { TtipobigliettoInterface } from '../interfaces/t_tipo_biglietto';


export class Ttipobiglietto implements TtipobigliettoInterface {


  id: number;
  idtipotaglia: number;
  d_tipo: string;
  prezzoUnico: string;
  stato: number;
  idevento: number;
  importo: number;
  ntot: number;
  npren: number;
  nemessi: number;
  ultimoemesso: number;
  serie: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;
// per relazioni
  d_stato_tipo_biglietto: string;

  constructor()  {

    this.id = 0;
    this.idtipotaglia = 0;
    this.d_tipo = '';
    this.prezzoUnico = '';
    this.stato = 0;
    this.idevento = 0;
    this.importo = 0;
    this.ntot = 0;
    this.npren = 0;
    this.nemessi = 0;
    this.ultimoemesso = 0;
    this.serie = '';
    this.key_utenti_operation  = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();
    // per relazioni
    this.d_stato_tipo_biglietto = '';

    }

}








