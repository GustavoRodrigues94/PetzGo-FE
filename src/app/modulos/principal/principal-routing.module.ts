import { AgendaContatosDetalhesComponent } from './agenda-contatos/agenda-contatos-detalhes/agenda-contatos-detalhes.component';
import { AgendamentoComponent } from './agendamento/agendamento.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrincipalComponent } from './principal.component';
import { AgendaContatosComponent } from './agenda-contatos/agenda-contatos-lista/agenda-contatos.component';

const routes: Routes = [
  {
    path: '',
    component: PrincipalComponent,
    children: [
      {
        path: 'agendar',
        component: AgendamentoComponent
      },
      {
        path: 'contatos',
        component: AgendaContatosComponent
      },
      {
        path: 'contatos/detalhes',
        component: AgendaContatosDetalhesComponent
      },
      {
        path: 'contatos/detalhes/:id',
        component: AgendaContatosDetalhesComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalRoutingModule { }
