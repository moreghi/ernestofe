import { wEventoTagliaBigliettoInterface } from '../interfaces/w_evento_taglia_biglietto';

export class WEventoTagliaBiglietto implements wEventoTagliaBigliettoInterface {

  id: number;
  idEvento: number;
  d_taglia: string;
  importo: number;
  nbiglietti: number;
  stato: number;
  flagpu: string;
  tagliaUser: string;
  serie: string;
  ultimoemesso: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor()  {

  this.id = 0;
  this.idEvento = 0;
  this.d_taglia = '';
  this.importo = 0;
  this.nbiglietti = 0;
  this.stato = 0;
  this.flagpu = '';
  this.tagliaUser = '';
  this.serie = '';
  this.ultimoemesso = 0;
  this.key_utenti_operation = 0;
  this.created_at = new Date();
  this.updated_at = new Date();

  }


}




