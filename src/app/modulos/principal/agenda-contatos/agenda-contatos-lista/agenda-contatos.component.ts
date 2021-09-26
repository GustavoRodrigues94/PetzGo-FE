import { SnackbarService } from './../../../../services/snackbar.service';
import { ICliente } from './../../../../interfaces/ICliente';
import { SpinnerService } from './../../../../services/spinner.service';
import { ClienteService } from './../../../../services/cliente.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'agenda-contatos',
  templateUrl: './agenda-contatos.component.html',
  styleUrls: ['./agenda-contatos.component.scss']
})
export class AgendaContatosComponent implements OnInit {
  exibicaoColunas: string[] = ['nomeCliente', 'whatsApp', 'endereco', 'pet', 'acoes'];
  dataSource = new MatTableDataSource<any>();

  constructor(private clienteService: ClienteService,
              private spinnerService: SpinnerService,
              private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.obterClientes();
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
}
