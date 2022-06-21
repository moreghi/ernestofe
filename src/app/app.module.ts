import { NgModule } from '@angular/core';                                                //
import { BrowserModule } from '@angular/platform-browser';                               //
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';                                 //
// da sistema
import { RouterModule, Routes} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';                                //
import { HttpClientModule } from '@angular/common/http';                                //
import { DatePipe } from '@angular/common';
import { FontAwesomeModule} from '@fortawesome/angular-fontawesome';                    //
import { FormsModule, ReactiveFormsModule } from '@angular/forms';                      //




// component utente
import { AppComponent } from './app.component';                                                           //
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/security/login/login.component';
import { RegistrazioneComponent } from './components/security/registrazione/registrazione.component';
import { UserComponent } from './components/users/user/user.component';

import { UsersComponent } from './components/users/users/users.component';
import { SignupComponent } from './components/security/signup/signup.component';
// per gestione messaggio esito operazione tipo popup a tempo
import { NotifierModule, NotifierOptions } from 'angular-notifier';                                         //
// utility
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPrintModule } from 'ngx-print';    // per fare la stampa commanda da Angular
import { ModalModule } from 'ngx-bootstrap/modal';  // per aprire una seconda popup dentro alla prima  (conferma Cancellazione)

// services
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { TruoloService } from './services/truolo.service';

import { TstatoutenteService } from './services/tstatoutente.service';
import { TokenStorageService } from './services/token-storage.service';
import { ForgotconfirmedService } from './services/forgotconfirmed.service';
import { ForgotconfirmedtestService } from './services/forgotconfirmedtest.service';
import { ChangepassService } from './services/changepass.service';
import { RouteGuardService } from './services/route-guard.service';
import { UploadFilesService } from './services/upload-files.service';

import { UserlevelService } from './services/userlevel.service';
import { AdesioneConfirmService } from './services/adesione-confirm.service';
import { QuotatesseraService } from './services/quotatassera.service';



import { SocioService } from './services/socio.service';

// component
import { SignupConfermeComponent } from './components/security/signup-conferme/signup-conferme.component';
import { ForgotPasswordComponent } from './components/security/forgotPassword/forgot-password/forgot-password.component';
import { ForgotPasswordConfermeComponent } from './components/security/forgotPassword/forgot-password-conferme/forgot-password-conferme.component';
import { ChangePasswordConfermeComponent } from './components/security/changePassword/change-password-conferme/change-password-conferme.component';
import { ChangePasswordNewUserComponent } from './components/security/change-password-new-user/change-password-new-user.component';
import { ChangePasswordComponent } from './components/security/changePassword/change-password/change-password.component';
import { Page404Component } from './components/page404/page404.component';



import { HomeComponent } from './components/home/home.component';
import { JumbotronComponent } from './components/jumbotron/jumbotron.component';
import { User1Component } from './components/users/user1/user1.component';







import { User2Component } from './components/users/user2/user2.component';
import { UserDetail1Component } from './components/users/user-detail1/user-detail1.component';
import { UserDetailComponent } from './components/users/user-detail/user-detail.component';




















import { PrenotazioneComponent } from './components/prenotaziones/prenotazione/prenotazione.component';










import { InfoComponent } from './components/popups/info/info.component';



import { RequestPrenotazioneComponent } from './components/prenotaziones/prenotazione/request-prenotazione/request-prenotazione.component';
import { ResponsePrenotazioneComponent } from './components/prenotaziones/prenotazione/response-prenotazione/response-prenotazione.component';
import { PrenotazioniComponent } from './components/prenotaziones/prenotazione/prenotazioni/prenotazioni.component';
import { Prenotazione1Component } from './components/prenotaziones/prenotazione1/prenotazione1.component';

















import { InfoPrenotazioneComponent } from './components/prenotaziones/info-prenotazione/info-prenotazione.component';
import { MessageComponent } from './components/popups/message/message.component';
import { TabelleComponent } from './components/tabelles/tabelle/tabelle.component';
import { TabellaComponent } from './components/tabelles/tabella/tabella.component';
import { TabellaTwDettComponent } from './components/tabelles/tabella-tw-dett/tabella-tw-dett.component';
import { TabellaTwDettPopComponent } from './components/popups/tabella-tw-dett-pop/tabella-tw-dett-pop.component';


import { SociComponent } from './components/socios/soci/soci.component';
import { SocioComponent } from './components/socios/socio/socio.component';
import { TesseramentoComponent } from './components/tesseramentos/tesseramento/tesseramento.component';
import { TesseramentoDetailComponent } from './components/tesseramentos/tesseramento-detail/tesseramento-detail.component';
import { TesseramentoDataComponent } from './components/tesseramentos/tesseramento-data/tesseramento-data.component';

import { SocioDetail1Component } from './components/socios/socio-detail1/socio-detail1.component';
import { SocioDetailComponent } from './components/socios/socio-detail/socio-detail.component';
import { LocalitapopComponent } from './components/popups/localitapop/localitapop.component';
import { SocioSearchpopComponent } from './components/popups/socio-searchpop/socio-searchpop.component';
import { RequestAdesioneComponent } from './components/adesiones/request-adesione/request-adesione.component';
import { ResponseAdesioneComponent } from './components/adesiones/response-adesione/response-adesione.component';
import { BandieragiallaDetailComponent } from './components/bandieragiallas/bandieragialla-detail/bandieragialla-detail.component';
import { QuotetesseraComponent } from './components/quotatesseras/quotetessera/quotetessera.component';
import { QuotatesseraComponent } from './components/quotatesseras/quotatessera/quotatessera.component';
import { QuotatesseraDetailComponent } from './components/quotatesseras/quotatessera-detail/quotatessera-detail.component';




/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 90,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 8000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};




@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RegistrazioneComponent,
    UserComponent,
    UsersComponent,
    SignupComponent,
    SignupConfermeComponent,
    ForgotPasswordComponent,
    ForgotPasswordConfermeComponent,
    ChangePasswordConfermeComponent,
    ChangePasswordNewUserComponent,
    ChangePasswordComponent,
    Page404Component,



    HomeComponent,
    JumbotronComponent,
    User1Component,







    User2Component,
    UserDetail1Component,
    UserDetailComponent,



















    PrenotazioneComponent,







    InfoComponent,


    RequestPrenotazioneComponent,
    ResponsePrenotazioneComponent,
    PrenotazioniComponent,
    Prenotazione1Component,


















    InfoPrenotazioneComponent,
    MessageComponent,
    TabelleComponent,
    TabellaComponent,
    TabellaTwDettComponent,
    TabellaTwDettPopComponent,


    SociComponent,
    SocioComponent,
    TesseramentoComponent,
    TesseramentoDetailComponent,
    TesseramentoDataComponent,

    SocioDetail1Component,
    SocioDetailComponent,
    LocalitapopComponent,
    SocioSearchpopComponent,
    RequestAdesioneComponent,
    ResponseAdesioneComponent,
    BandieragiallaDetailComponent,
    QuotetesseraComponent,
    QuotatesseraComponent,
    QuotatesseraDetailComponent



  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    NgxPaginationModule,
    RouterModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NotifierModule.withConfig(customNotifierOptions),
    Ng2SearchPipeModule,
    NgxPrintModule,
    ModalModule.forRoot(),
  ],
  providers: [AuthService, DatePipe, UserService, TruoloService,TokenStorageService,ForgotconfirmedService,ForgotconfirmedtestService,
              ChangepassService,RouteGuardService,TstatoutenteService,UploadFilesService,
              UserlevelService, SocioService, AdesioneConfirmService,QuotatesseraService],
  bootstrap: [AppComponent]
})
export class AppModule { }
