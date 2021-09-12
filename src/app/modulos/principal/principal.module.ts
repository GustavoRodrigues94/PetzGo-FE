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

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [PrincipalComponent, AgendamentoComponent, NovoAgendamentoComponent],
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
