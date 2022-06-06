import { MessageInterface } from './../interfaces/message';

export class Message implements MessageInterface {

  id: number;
  tipo: string;
  title: string;
  message01: string;
  message02: string;
  image: string;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.tipo = '';
    this.title = '';
    this.message01 = '';
    this.message02 = '';
    this.image = '';
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}
