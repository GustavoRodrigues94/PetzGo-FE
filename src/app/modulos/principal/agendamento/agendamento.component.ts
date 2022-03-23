import { AgendamentoService } from './../../../services/agendamento.service';
import { NovoAgendamentoComponent } from './novo-agendamento/novo-agendamento.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import { CalendarOptions } from '@fullcalendar/angular';
import { MatDialog } from '@angular/material/dialog';

@Component({
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.scss']
})
export class AgendamentoComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    handleWindowResize: false,
    nowIndicator: true,
    locale: 'pt-br',
    initialView: 'timeGridWeek',
    visibleRange: {
      start: '2021-08-26',
      end: '2021-09-01'
    },
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',

    },
    allDaySlot: false,
    headerToolbar: {
      right: 'timeGridWeek,timeGridDay',

    },
    views: {
      timeGridDay: {
        type: 'timeGrid',
        duration: { days: 1 },
        buttonText: 'Hoje'
      },
      timeGridWeek: {
        type: 'timeGridWeek',
        buttonText: 'Semana'
      }
    },
    plugins: [ dayGridPlugin, timeGrigPlugin ],
    events: [],
    eventColor: '#278be8',
    eventDisplay: 'block',
    dateClick: this.manipularDataClicada.bind(this),
    eventClick: this.manipularEventoClicado.bind(this),
  };

  constructor(public dialog: MatDialog,
              private agendamentoService: AgendamentoService) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void{
    this.calendarOptions.handleWindowResize = true;
  }

  manipularDataClicada(evento: any){
    this.abrirModalNovoAgendamento(evento);
  }

  manipularEventoClicado(evento){
    //this.clickHoverMenuTrigger.openMenu();
  }

  private abrirModalNovoAgendamento(evento: any) {
    const dialogRef = this.dialog.open(NovoAgendamentoComponent, {
      disableClose: true,
      panelClass: "dialog-responsive",
      data: { evento }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if(resultado)
      {
        //this.agendamentoService.ObterAgendamentos();
      }
    });
  }

}
