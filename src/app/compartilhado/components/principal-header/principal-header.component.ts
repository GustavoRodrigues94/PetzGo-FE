import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'principal-header',
  templateUrl: './principal-header.component.html',
  styleUrls: ['./principal-header.component.scss']
})
export class PrincipalHeaderComponent implements OnInit {
  @Input() titulo: string;
  @Input() subtitulo: string;
  @Input() rotaBotaoNovo: string;
  @Input() textoBotaoNovo: string;
  @Input() rotaBotaoVoltar: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  irParaRotaBotaoNovo(){
    this.router.navigate(['contatos/detalhes']);
  }

}
