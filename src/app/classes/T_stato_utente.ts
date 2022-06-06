
import { TstatoutenteInterface } from '../interfaces/t_stato_utente';


export class TstatoUtente implements TstatoutenteInterface {

  id: number;
  d_stato_utente: string;
  tappo: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor()  {

    this.id = 0;
    this.d_stato_utente = '';
    this.tappo = 'N';
    this.key_utenti_operation  = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }

}
