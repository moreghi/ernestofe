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
import { ManifestazioniComponent } from './components/manifestaziones/manifestazioni/manifestazioni.component';
import { ManifestazioneDetailComponent } from './components/manifestaziones/manifestazione-detail/manifestazione-detail.component';
import { ManifestazioneDaysComponent } from './components/manifestaziones/manifestazione-days/manifestazione-days.component';
import { EventoDetailComponent } from './components/eventos/evento-detail/evento-detail.component';
import { EventoTicketComponent } from './components/eventos/evento-ticket/evento-ticket.component';
import { TipobigliettoDetailComponent } from './components/tipobigliettos/tipobiglietto-detail/tipobiglietto-detail.component';
import { LogisticheComponent } from './components/logisticas/logistiche/logistiche.component';
import { LogisticaDetailComponent } from './components/logisticas/logistica-detail/logistica-detail.component';
import { LogisticaDetailPostiComponent } from './components/logisticas/logistica-detail-posti/logistica-detail-posti.component';
import { EventoPostiComponent } from './components/eventos/evento-posti/evento-posti.component';
import { EventiMappaComponent } from './components/eventos/eventi-mappa/eventi-mappa.component';
import { RequestEventoNormalComponent } from './components/eventos/registrazione/evento/request-evento-normal/request-evento-normal.component';
import { RequestEventoLogisticaComponent } from './components/eventos/registrazione/eventologistica/request-evento-logistica/request-evento-logistica.component';
import { ResponseEventoNormalComponent } from './components/eventos/registrazione/evento/response-evento-normal/response-evento-normal.component';
import { EventoPostiDetailComponent } from './components/eventos/evento-posti-detail/evento-posti-detail.component';
import { ResponseEventoLogisticaComponent } from './components/eventos/registrazione/eventologistica/response-evento-logistica/response-evento-logistica.component';
import { PrenotazionieventoComponent } from './components/prenotazeventos/prenotazionievento/prenotazionievento.component';
import { CassaDetailComponent } from './components/cassas/cassa-detail/cassa-detail.component';
import { BigliettoEmissioneLogisticaComponent } from './components/bigliettos/biglietto-emissione-logistica/biglietto-emissione-logistica.component';
import { BigliettoDetailComponent } from './components/bigliettos/biglietto-detail/biglietto-detail.component';
import { AbilitazioneComponent } from './components/security/abilitazione/abilitazione.component';
import { TestuploadComponent } from './components/testupload/testupload.component';
import { PrenotazioniEventiComponent } from './components/prenotaziones/prenotazioni-eventi/prenotazioni-eventi.component';
import { PrenotazioneDetailComponent } from './components/prenotaziones/prenotazione-detail/prenotazione-detail.component';
import { LogisticaDetailMappapostiComponent } from './components/logisticas/logistica-detail-mappaposti/logistica-detail-mappaposti.component';
import { PrenotazioneDetailPostoComponent } from './components/prenotaziones/prenotazione-detail-posto/prenotazione-detail-posto.component';
import { PrenotazioneDetailNologisticaComponent } from './components/prenotaziones/prenotazione-detail-nologistica/prenotazione-detail-nologistica.component';
import { ResponsePrenotazioneEventoComponent } from './components/eventos/registrazione/masterprenotazione/response-prenotazione-evento/response-prenotazione-evento.component';
import { EventoPrenotDetailComponent } from './components/eventos/evento-prenot-detail/evento-prenot-detail.component';
import { BigliettoEmissioneDetailComponent } from './components/bigliettos/biglietto-emissione-detail/biglietto-emissione-detail.component';
import { RequestEventoNormal1Component } from './components/eventos/registrazione/evento/request-evento-normal1/request-evento-normal1.component';
import { CassaDetailDayComponent } from './components/cassas/cassa-detail-day/cassa-detail-day.component';
import { ComunicatiComponent } from './components/comunicatos/comunicati/comunicati.component';


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
// ----------------------------------------------------------------  Manifestazione
{
  path: 'manif',
  component: ManifestazioniComponent
},
{
  path: 'manif/edit/:id',
  component: ManifestazioneDetailComponent
},
{
  path: 'manif/new',
  component: ManifestazioneDetailComponent
},
{
  path: 'manif/:id',
  component: ManifestazioneDaysComponent
},
// ----------------------------------------------------------------  Eventi
{
  path: 'evento/new/:idManif',
  component: EventoDetailComponent
},
{
  path: 'evento/edit/:id/:idManif',
  component: EventoDetailComponent
},
{
  path: 'evento/:id/Posti',
  component: EventoPostiComponent
},

{
  path: 'evento/:id/S/:idSett/F/:idFila',
  component: EventoPostiDetailComponent
},

// ---------------------------------------------------------------  mappa di registrazione n evevnti
{
  path: 'evento/registrazione',
  component: EventiMappaComponent
},
{
  path: 'evento/registrazione/normal/:id',     // registrazione evento senza logistica  <---
  component: RequestEventoNormalComponent
},
{
  path: 'evento/registrazione/normal1/:id',     // refistrazione evento senza logistica
  component: RequestEventoNormal1Component
},
{
  path: 'evento/registrazione/logistica/:id',
  component: RequestEventoLogisticaComponent
},

{
  path: 'evento/prenotazionenormaleConferma',
   component: ResponseEventoNormalComponent
},
{
  path: 'evento/prenotazionelogisticaConferma',
   component: ResponseEventoLogisticaComponent
},
// risposta prenotazione Master
{
  path: 'evento/prenotazioneeventoConferma',
   component: ResponsePrenotazioneEventoComponent
},





// ----------------------------------------------------------------  tipo biglietto per eventi
{
  path: 'evento/:id/tipobiglietti',
  component: EventoTicketComponent
},
{
  path: 'tbiglietto/new/:idEvento',
  component: TipobigliettoDetailComponent
},
{
  path: 'tbiglietto/edit/:id',
  component: TipobigliettoDetailComponent
},
// ---------------------------------------------------------------- Gestione Prenotazioni
{
  path: 'Evento/prenotdetail/:id',
  component: EventoPrenotDetailComponent
},
// ----------------------------------------------------------------  tipo biglietto per eventi
{
  path: 'biglietto/:id/edit',
  component: BigliettoEmissioneDetailComponent        //BigliettoDetailComponent   creava problemi
},



// ----------------------------------------------------------------  Prenotazioni evento
{
  path: 'pronotevento',
  component: PrenotazionieventoComponent
},
{
  path: 'prenotevento/:id/biglietto',
  component: BigliettoEmissioneLogisticaComponent
},
// ----------------------------------------------------------------  logistiche
{
  path: 'logistica',
  component: LogisticheComponent
},
{
  path: 'logistica/new',
  component: LogisticaDetailComponent
},
{
  path: 'logistica/edit/:id',
  component: LogisticaDetailComponent
},
// ----------------------------------------------------------------  logistica - mappatura posti
{
  path: 'logposti/:id/new',
  component: LogisticaDetailPostiComponent
},
{
  path: 'logposti/:id/edit',
  component: LogisticaDetailPostiComponent
},
{
  path: 'logposti/:id/edit/:idp/posti',
  component: LogisticaDetailPostiComponent
},

{
  path: 'logmappaposti/:id/crea',
  component: LogisticaDetailMappapostiComponent
},



// -------------------------------------------------------------------------   Cassa
{
  path: 'cassa/:dataodierna/tipo/:tipo/:idEvento',    //   path: 'cassa/:dataodierna/tipo/:tipo',
  component: CassaDetailComponent
},
{
  path: 'cassa/:idEvento',    //   path: 'cassa/:dataodierna/tipo/:tipo',
  component: CassaDetailDayComponent
},




// -------------------------------------------------------------------------   soci   --- test Bandiera gialla
{
  path: 'socio',
  component: SociComponent,
 // canActivate: [RouteGuardService]
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
{
  path: 'prenotEventi/:id/:nev',
   component: PrenotazioniEventiComponent
},

{
  path: 'prenEventi/edit/:idev/:id',
   component: PrenotazioneDetailComponent
},
{
  path: 'prenEventi/new/:idev',
   component: PrenotazioneDetailComponent
},
{
  path: 'prenEventi/nol/new/:idev',
   component: PrenotazioneDetailNologisticaComponent
},



{
  path: 'prenPosto/:id/:idposto',
   component: PrenotazioneDetailPostoComponent
},
// ----------------------------------------------------------------  Comunicazioni
{
  path: 'comunic',
   component: ComunicatiComponent
},


// ----------------------------------------------------------------  Tesseramento

{
  path: 'socio/tessera/:id',
   component: TesseramentoDetailComponent,
   canActivate: [RouteGuardService]
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
  // -------------------------------------------------------------------------------------   abilitazione
  {
    path: 'users/abil/:id',
    component: AbilitazioneComponent,
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
  {
    path: 'home',
    component: HomeComponent
  },

  {
    path: 'testupload',
    component: TestuploadComponent
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



