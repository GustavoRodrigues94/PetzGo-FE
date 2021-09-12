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
    handleWindowResize: true,
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
    events: [
      {
        title: 'Cachorro Fernandinho',
        start: '2021-08-26T10:30:00',
        end: '2021-08-26T11:30:00',
        extendedProps: {
          department: 'BioChemistry'
        },
        description: 'Banho & Tosa',
        display: ''
      },
      {
        title: 'Gato Kikão',
        start: '2021-08-26T13:30:00',
        end: '2021-08-26T14:30:00',
        extendedProps: {
          department: 'BioChemistry'
        },
        description: 'Banho & Tosa'
      },
      {
        title: 'Gato Xaninha',
        start: '2021-08-26T15:30:00',
        end: '2021-08-26T17:45:00',
        extendedProps: {
          department: 'BioChemistry'
        },
        description: 'Banho & Tosa',
        constraint: {

        }
      }
    ],
    eventColor: '#278be8',
    eventDisplay: 'block',
    dateClick: this.manipularDataClicada.bind(this),
    eventClick: this.manipularEventoClicado.bind(this),
  };

  constructor(public dialog: MatDialog) {

  }

  ngOnInit(): void {

  }

  manipularDataClicada(evento: any){
    console.log(evento);
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

    dialogRef.afterClosed().subscribe(() => {

    });
  }

}
