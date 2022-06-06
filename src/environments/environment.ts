// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// per ambiente di sviluppo su localhost

export const environment = {
  production: false,
  APIURL: 'http://localhost:3001',
  APIAUTURL: 'http://localhost:3001/api/auth/',
  IMGURL: 'http://localhost:3001/storage/posts/'
};


/*
// per ambiente di produzione su Vercel
export const environment = {
  production: false,
  APIURL: 'https://sifbe.herokuapp.com',
  APIAUTURL: 'https://sifbe.herokuapp.com/api/auth/',
  IMGURL: 'https://sifbe.herokuapp.com/storage/posts/'
};
*/




/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
