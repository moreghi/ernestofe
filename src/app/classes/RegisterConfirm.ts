import { RegisterConfirmInterface } from '../interfaces/registerConfirm';

export class RegisterConfirm implements RegisterConfirmInterface {

 cognome: string;
 nome: string;
 username: string;
 email: string;
 password: string;
 token: string;
 created_at: Date;

  constructor()  {

    this.cognome = '';
    this.nome = '';
    this.username = '';
    this.email = '';
    this.password = '';
    this.token = '';
    this.created_at = new Date();

  }

}
