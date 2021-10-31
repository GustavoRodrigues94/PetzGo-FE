import { ListaSemRegistrosComponent } from './../../compartilhado/components/lista-sem-registros/lista-sem-registros.component';
import { PrincipalHeaderComponent } from './../../compartilhado/components/principal-header/principal-header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../../material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrincipalRoutingModule } from './principal-routing.module';
import { PrincipalComponent } from './principal.component';
import { AgendamentoComponent } from './agendamento/agendamento.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NovoAgendamentoComponent } from './agendamento/novo-agendamento/novo-agendamento.component';
import { NgxMaskModule } from 'ngx-mask';
import { AgendaContatosComponent } from './agenda-contatos/agenda-contatos-lista/agenda-contatos.component';
import { AgendaContatosDetalhesComponent } from './agenda-contatos/agenda-contatos-detalhes/agenda-contatos-detalhes.component';


FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    PrincipalComponent,
    AgendamentoComponent,
    NovoAgendamentoComponent,
    AgendaContatosComponent,
    AgendaContatosDetalhesComponent,
    PrincipalHeaderComponent,
    ListaSemRegistrosComponent
  ],
  imports: [
    CommonModule,
    PrincipalRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FullCalendarModule,
    NgxMaskModule.forRoot(),
  ]
})
export class PrincipalModule { }
