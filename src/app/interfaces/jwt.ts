/*  interfaccia per jwt  */


export interface JwtInterface  {

  // definisco l'interfaccia dei dati che ottengo dalla chiamata di login
 accessToken: string;
 token_type: string;
 expires_in: number;
  // parametri aggiuntivi - vedi AuthController in laraapi
 username: string;
 cognome: string;
 email: string;
 idruoloday: string;
 level: string;
 id: number;
 idruoloweb: number;


}

