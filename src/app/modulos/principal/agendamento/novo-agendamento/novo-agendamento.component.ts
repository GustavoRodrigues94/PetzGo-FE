import { SnackbarService } from './../../../../services/snackbar.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { IServico } from './../../../../interfaces/IServico';
import { ICliente } from 'src/app/interfaces/ICliente';
import { ClientePesquisaStatus } from './enums/cliente-pesquisa-status.enum';
import { EmpresaService } from '../../../../services/empresa.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IPetCaracteristica } from 'src/app/interfaces/IPetCaracteristica';
import { ClienteService } from 'src/app/services/cliente.service';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { IAdicionarAgendamentoComando } from 'src/app/interfaces/IAdicionarAgendamentoComando';

@Component({
  templateUrl: './novo-agendamento.component.html',
  styleUrls: ['./novo-agendamento.component.scss']
})
export class NovoAgendamentoComponent implements OnInit {
  formAgendamento: FormGroup;
  clienteNovoForm: FormGroup;
  petClienteNovoForm: FormGroup;
  clientePesquisaStatus: ClientePesquisaStatus = 0;
  clienteAgendamento: ICliente;
  servicos: IServico[];
  deveExibirTempoValorServico: boolean = false;

  foods: any[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  myControl = new FormControl();
  options: IPetCaracteristica[] = [];
  filteredOptions: Observable<IPetCaracteristica[]>;

  constructor(public dialogRef: MatDialogRef<NovoAgendamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private clienteService: ClienteService,
    private agendamentoService: AgendamentoService,
    private spinnerService: SpinnerService,
    private snackBarService: SnackbarService) {
    }

  ngOnInit(): void {
    this.carregarFormularios();

    this.empresaService.obterTodosPetCaracteristicas().subscribe((res: IPetCaracteristica[]) =>{
      this.options = res;
    });

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
  }

  private _filter(value: string): IPetCaracteristica[] {
    console.log(value);
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.petCaracteristica.toLowerCase().includes(filterValue));
  }

  displayFn(petCaracteristica: IPetCaracteristica): string {
    return petCaracteristica && petCaracteristica.petCaracteristica ? petCaracteristica.petCaracteristica : '';
  }

  carregarFormularios() {
    let horaSelecionada = `${("0" + this.data.evento.date.getHours()).slice(-2)}:${("0" + this.data.evento.date.getMinutes()).slice(-2)}`;
    this.formAgendamento = this.formBuilder.group({
      horaInicio: [horaSelecionada,  Validators.required],
      horaFim: [''],
      whatsApp: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: [''],
      clienteId: ['', Validators.required],
      petId: ['', Validators.required],
      servicoId: ['', Validators.required],
      tempoEmMinutos: ['', Validators.required],
      valorServico: ['', Validators.required]
    });

    this.clienteNovoForm = this.formBuilder.group({
      whatsApp: ['', Validators.required],
      nome: ['', Validators.required]
    });

    this.petClienteNovoForm = this.formBuilder.group({
      nome: ['', Validators.required]
    });
  }

  finalizarNovoCliente(){
    this.clientePesquisaStatus = ClientePesquisaStatus.ClientePreCadastrado;
  }

  buscarCliente(){
    const whatsApp = this.formAgendamento.get('whatsApp').value;

    this.clienteService.obterClientePorWhatsApp(whatsApp).subscribe((cliente : ICliente) => {
      if(cliente){
        this.alterarStatusClienteEncontrado(cliente);
        return;
      }

      this.clienteNovoForm.patchValue({
        whatsApp: whatsApp
      });

      this.clientePesquisaStatus = ClientePesquisaStatus.ClienteNaoEncontrado;
    });
  }

  private alterarStatusClienteEncontrado(cliente: ICliente) {
    this.clienteAgendamento = cliente;

    this.formAgendamento.patchValue({
      petId: cliente.pet.id,
      clienteId: cliente.id
    });

    this.clientePesquisaStatus = ClientePesquisaStatus.ClienteEncontrado;

    this.empresaService.obterTodosServicos().subscribe((res: IServico[]) => {
      this.servicos = res;
    });
  }

  buscarClienteNovamente(){
    this.clientePesquisaStatus = ClientePesquisaStatus.BuscarClienteNovamente;
  }


  cancelarAgendamento(){
    this.dialogRef.close();
  }

  selecionarServico(servicoId: string){
    this.formAgendamento.patchValue({
      servicoId: servicoId,
      dataInicio: this.data.evento.date
    });

    const idPetCaracteristica = this.clienteAgendamento.pet.idPetCaracteristica;
    this.empresaService.obterServicoEmpresaPetCaracteristica(servicoId, idPetCaracteristica).subscribe((res: IServico) => {
      if(!res){
        this.exibirTempoValorServico(false);
        return;
      }

      this.exibirTempoValorServico(true);
    });
  }

  exibirTempoValorServico(tempoValorEncontrado: boolean) {
    this.deveExibirTempoValorServico = true;
  }

  manipularTerminoServico(){
    const tempoEmMinutosServico = this.formAgendamento.get('tempoEmMinutos').value;
    const horaInicio = this.formAgendamento.get('horaInicio').value;

    //TODO CALCULAR FIM e EXIBIR
  }

  confirmarAgendamento(){
    if(this.formAgendamento.invalid) return;

    this.spinnerService.exibirSpinner();

    const agendamento = this.formAgendamento.getRawValue() as IAdicionarAgendamentoComando
    this.agendamentoService.adicionarAgendamento(agendamento).subscribe(res => {
      this.spinnerService.pararSpinner();
      if(res.sucesso)
        this.snackBarService.abrirMensagemSucesso('Agendamento adicionado com sucesso.');
      else
        this.snackBarService.abrirMensagemInformacao(res.mensagem);
    }, () => {
        this.spinnerService.pararSpinner();
    });
  }

}
