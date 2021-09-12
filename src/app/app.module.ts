import { SnackbarComponent } from './compartilhado/snackbar/snackbar.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AutenticacaoModule } from './modulos/autenticacao/autenticacao.module';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    SnackbarComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    OverlayModule,
    NgxMaskModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    AutenticacaoModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
