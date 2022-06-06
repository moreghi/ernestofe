
import { userlevelInterface } from '../interfaces/userlevel';


export class Userlevel implements userlevelInterface {

  id: number;
  UserLevelName: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor()  {
    this.id = 0;
    this.UserLevelName = '';
    this.key_utenti_operation = 0;
    this.created_at = new Date();
    this.updated_at = new Date();
  }


}
