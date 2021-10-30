import { Router } from '@angular/router';
import { SpinnerService } from './../../../../services/spinner.service';
import { ClienteService } from './../../../../services/cliente.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { RotasPaginas } from 'src/app/compartilhado/enums/rotas.enum';

@Component({
  selector: 'agenda-contatos',
  templateUrl: './agenda-contatos.component.html',
  styleUrls: ['./agenda-contatos.component.scss']
})
export class AgendaContatosComponent implements OnInit {
  exibicaoColunas: string[] = ['nomeCliente', 'whatsApp', 'endereco', 'pet', 'acoes'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginacao: MatPaginator;

  constructor(private clienteService: ClienteService,
              private spinnerService: SpinnerService,
              private router: Router) { }

  ngOnInit(): void {
    this.obterClientes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginacao;
  }

  ngOnDestroy() : void {
    this.dataSource.disconnect();
  }

  obterClientes() {
    this.spinnerService.exibirSpinner();
    this.clienteService.obterClientes().subscribe((res) => {
      this.dataSource.data = res;
      this.spinnerService.pararSpinner();
    }, error => {
      this.spinnerService.pararSpinner();
    });
  }

  obterImagemPet(tipoPet: string) : string {
    if(tipoPet == "Cachorro")
      return "assets/imagens/cachorro.png";
    else
      return "assets/imagens/gato.png";
  }

  desativarAtivarContato(element){
    this.clienteService.desativarAtivarCliente(element.id, !element.ativo).subscribe(res => {
      element.ativo = !element.ativo;
    });
  }

  abrirWhatsApp(whatsApp: string) : string{
    return `https://wa.me/55${whatsApp}`
  }

  obterTooltipBotaoAtivarDesativar(element){
    if(element.ativo)
      return "Desativar contato";
    else
      return "Ativar contato";
  }

  aplicarFiltro = (textoDigitado: string) => {
    this.dataSource.filter = textoDigitado.trim().toLocaleLowerCase();
  }

  obterRotaBotaoNovo() : string {
    return RotasPaginas.RotaPadraoNovo;
  }

}
