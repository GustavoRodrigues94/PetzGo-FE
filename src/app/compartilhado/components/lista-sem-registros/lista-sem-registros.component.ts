import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lista-sem-registros',
  templateUrl: './lista-sem-registros.component.html',
  styleUrls: ['./lista-sem-registros.component.scss']
})
export class ListaSemRegistrosComponent implements OnInit {
  @Input() rotaBotaoAdicionar: string;

  constructor() { }

  ngOnInit() {}

}
