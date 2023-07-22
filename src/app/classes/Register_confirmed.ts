import { RegisterconfirmedInterface } from './../interfaces/register_confirmed';


export class Registerconfirmed implements RegisterconfirmedInterface  {

  id: number;
  cognome: string;
  nome: string;
  email: string;
  username: string;
  password: string;
  token: string;
  created_at: Date;
  updated_at: Date;

  constructor()  {

    this.id = 0;
    this.cognome = '';
    this.nome = '';
    this.email = '';
    this.username = '';
    this.password = '';
    this.token = '';
    this.created_at = new Date();
    this.updated_at = new Date();

  }

}
