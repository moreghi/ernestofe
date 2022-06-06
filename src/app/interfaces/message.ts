/*  interfaccia per message */


export interface MessageInterface {

  id: number;
  tipo: string;
  title: string;
  message01: string;
  message02: string;
  image: string;
  created_at: Date;
  updated_at: Date;

}
