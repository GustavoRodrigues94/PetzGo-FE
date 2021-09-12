import { ClientePesquisaStatus } from './enums/cliente-pesquisa-status.enum';
import { EmpresaService } from '../../../../services/empresa.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IPetCaracteristica } from 'src/app/interfaces/IPetCaracteristica';

@Component({
  templateUrl: './novo-agendamento.component.html',
  styleUrls: ['./novo-agendamento.component.scss']
})
export class NovoAgendamentoComponent implements OnInit {
  formAgendamento: FormGroup;
  clienteNovoForm: FormGroup;
  petClienteNovoForm: FormGroup;
  clientePesquisaStatus: ClientePesquisaStatus = 0;

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
    private empresaService: EmpresaService) {

    }

  ngOnInit(): void {
    this.carregarFormulario();
    this.clienteNovoForm = this.formBuilder.group({
      whatsApp: ['', Validators.required],
      nome: ['', Validators.required]
    });
    this.petClienteNovoForm = this.formBuilder.group({
      nome: ['', Validators.required]
    });

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

  carregarFormulario() {
    let horaSelecionada = `${("0" + this.data.evento.date.getHours()).slice(-2)}:${("0" + this.data.evento.date.getMinutes()).slice(-2)}`;
    this.formAgendamento = this.formBuilder.group({
      horaInicio: [horaSelecionada,  Validators.required],
      horaFim: [''],
    });
  }

  finalizarNovoCliente(){
    this.clientePesquisaStatus = ClientePesquisaStatus.ClientePreCadastrado;

  }

  buscarCliente(){
    this.clientePesquisaStatus = ClientePesquisaStatus.ClienteNaoEncontrado;
  }

  buscarClienteNovamente(){
    this.clientePesquisaStatus = ClientePesquisaStatus.BuscarClienteNovamente;
  }

  obterServicosPorPetCaracteristica(){

  }

  cancelarAgendamento(){
    this.dialogRef.close();
  }

}
