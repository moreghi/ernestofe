import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// service
import { RouteGuardService } from './services/route-guard.service';
// componenti utente
import { LoginComponent } from './components/security/login/login.component';
import { RegistrazioneComponent } from './components/security/registrazione/registrazione.component';
import { UsersComponent } from './components/users/users/users.component';

import { SignupComponent } from './components/security/signup/signup.component';
import { SignupConfermeComponent } from './components/security/signup-conferme/signup-conferme.component';
import { ForgotPasswordComponent } from './components/security/forgotPassword/forgot-password/forgot-password.component';
import { ForgotPasswordConfermeComponent } from './components/security/forgotPassword/forgot-password-conferme/forgot-password-conferme.component';
import { ChangePasswordNewUserComponent } from './components/security/change-password-new-user/change-password-new-user.component';
import { ChangePasswordConfermeComponent } from './components/security/changePassword/change-password-conferme/change-password-conferme.component';
import { ChangePasswordComponent } from './components/security/changePassword/change-password/change-password.component';
import { Page404Component } from './components/page404/page404.component';


import { HomeComponent } from './components/home/home.component';
import { JumbotronComponent } from './components/jumbotron/jumbotron.component';







// import { UserDetail1Component } from './components/users/user-detail1/user-detail1.component';  // test
import { UserDetailComponent } from './components/users/user-detail/user-detail.component';















import { RequestPrenotazioneComponent } from './components/prenotaziones/prenotazione/request-prenotazione/request-prenotazione.component';
import { ResponsePrenotazioneComponent } from './components/prenotaziones/prenotazione/response-prenotazione/response-prenotazione.component';
import { PrenotazioniComponent } from './components/prenotaziones/prenotazione/prenotazioni/prenotazioni.component';











import { InfoPrenotazioneComponent } from './components/prenotaziones/info-prenotazione/info-prenotazione.component';
import { TabelleComponent } from './components/tabelles/tabelle/tabelle.component';
import { SociComponent } from './components/socios/soci/soci.component';
import { TesseramentoDetailComponent } from './components/tesseramentos/tesseramento-detail/tesseramento-detail.component';
import { TesseramentoDataComponent } from './components/tesseramentos/tesseramento-data/tesseramento-data.component';

import { SocioDetail1Component } from './components/socios/socio-detail1/socio-detail1.component';
import { SocioDetailComponent } from './components/socios/socio-detail/socio-detail.component';
import { RequestAdesioneComponent } from './components/adesiones/request-adesione/request-adesione.component';
import { ResponseAdesioneComponent } from './components/adesiones/response-adesione/response-adesione.component';
import { BandieragiallaDetailComponent } from './components/bandieragiallas/bandieragialla-detail/bandieragialla-detail.component';
import { QuotetesseraComponent } from './components/quotatesseras/quotetessera/quotetessera.component';
import { QuotatesseraDetailComponent } from './components/quotatesseras/quotatessera-detail/quotatessera-detail.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registration',
    component: RegistrazioneComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'signupConferme',
    component: SignupConfermeComponent
  },

  {
    path: 'forgotpassword',
    component: ForgotPasswordComponent
  },
  {
    path: 'forgotpasswordConferme',
    component: ForgotPasswordConfermeComponent
  },
  {
    path: 'jumbotron',
    component: JumbotronComponent
  },
  // -------------------------------------------------------  Bandiera Gialla
{
  path: 'yellowFlat',
   component: BandieragiallaDetailComponent
},
// -------------------------------------------------------  Quota Tessera
{
  path: 'quotat',
   component: QuotetesseraComponent
},
// -------------------------------------------------------  Quota Tessera - dettaglio
{
  path: 'quotat/new',
   component: QuotatesseraDetailComponent
},
{
  path: 'quotat/:id',
   component: QuotatesseraDetailComponent
},
// -------------------------------------------------------  Richiesta adesione
{
  path: 'requestConfirmAdesione',
   component: RequestAdesioneComponent
},
{
  path: 'adesioneConferma',
   component: ResponseAdesioneComponent
},

// dettaglio giornata della manifestazione  -- dettaglio Info

// dettaglio giornata della manifestazione  -- dettaglio Cassa



// dettaglio giornata della manifestazione  -- dettaglio Cassa1  nuova versione col elenco


// -------------------------------------------------------------------------   soci   --- test Bandiera gialla
{
  path: 'socio',
  component: SociComponent
},

{
  path: 'socio/edit/:id',
   component: SocioDetailComponent
},
{
  path: 'socio/new',
   component: SocioDetailComponent
},

{
  path: 'test/edit/:id',
   component: SocioDetail1Component
},
{
  path: 'test/new',
   component: SocioDetail1Component
},


// dettaglio giornata della manifestazione  -- dettaglio Commande




// REgistrazione Commanda - Anagrafica

// REgistrazione Commanda - Prodotti

// REgistrazione Commanda - Cassa


// -------------------------------------------------------  Prenotazioni
{
  path: 'requestConfirmPrenotazione',
   component: RequestPrenotazioneComponent
},
{
  path: 'prenotazioneConferma',
   component: ResponsePrenotazioneComponent
},
{
  path: 'prenotazione',
   component: PrenotazioniComponent,
   canActivate: [RouteGuardService]
},

{
  path: 'prenotazione/infor',
   component: InfoPrenotazioneComponent
},

// ----------------------------------------------------------------  Tesseramento

{
  path: 'socio/tessera/:id',
   component: TesseramentoDetailComponent
},
{
  path: 'socio/rinn/:id',
   component: TesseramentoDataComponent
},




// ----------------------------------------------------------------  Tabelle
{
  path: 'tabella',
  component: TabelleComponent
},
// ----------------------------------------------------------------  Manifestazione



// ------------------------------------------------------------------  Users


  {
    path: 'users',
    component: UsersComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'users/inqu/:id',
    component: UserDetailComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'users/edit/:id',
    component:  UserDetailComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'users/edits/:id',
    component: UserDetailComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'users/new',
    component: UserDetailComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'chgpswnuwuser',
    component: ChangePasswordNewUserComponent
  },
  {
    path: 'changePassword',
    component: ChangePasswordComponent
  },
  {
    path: 'changepasswordConferme',
    component: ChangePasswordConfermeComponent
  },
  {
    path: 'page404',
    component: Page404Component
  },
  // ----------------------------------------------------------------- Spese

  // ----------------------------------------------------------------- Fornitori



  // ----------------------------------------------------------------- Prodotti


  // ----------------------------------------------------------------- Persona


 // ---------------------------------------------------------------------- Moduli




  // abilitazioni per livello -----------------------



  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: 'jumbotron',  //home   // login
    pathMatch: 'full'
  },

  //  ultimo
  {
    path: '**',
    redirectTo: 'page404',
    pathMatch: 'full'
  },

 ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }



