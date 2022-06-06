
import { ChangePasswordInterface } from './../interfaces/change-password';


export class ChangePassword implements ChangePasswordInterface  {


  email: string;
  username: string;
  cognome: string;
  nome: string;
  created_at: Date;
  updated_at: Date;
  constructor()  {

    this.email = '';
    this.username = '';
    this.cognome = '';
    this.nome = '';
    this.created_at = new Date();
    this.updated_at = new Date();

  }

}
