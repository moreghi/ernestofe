import { RegisterconfirmedInterface } from './../interfaces/register_confirmed';


export class Registerconfirmed implements RegisterconfirmedInterface  {

  email: string;
  id_titolo: number;
  username: string;
  cognome: string;
  nome: string;
  password: string;
  token: string;
  created_at: Date;
  updated_at: Date;
  constructor()  {

    this.email = '';
    this.id_titolo = 0;
    this.username = '';
    this.cognome = '';
    this.nome = '';
    this.password = '';
    this.token = '';
    this.created_at = new Date();
    this.updated_at = new Date();

  }

}
