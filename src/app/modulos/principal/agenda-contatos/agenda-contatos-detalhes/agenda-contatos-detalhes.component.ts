import { SnackbarService } from './../../../../services/snackbar.service';
import { ClienteService } from './../../../../services/cliente.service';
import { ConsultaCepService } from './../../../../services/consulta-cep.service';
import { EmpresaService } from './../../../../services/empresa.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IPetCaracteristica } from 'src/app/interfaces/IPetCaracteristica';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IConsultaCep } from 'src/app/interfaces/IConsultaCep';
import { ICliente } from 'src/app/interfaces/ICliente';
import { MatStepper } from '@angular/material/stepper';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'agenda-contatos-detalhes',
  templateUrl: './agenda-contatos-detalhes.component.html',
  styleUrls: ['./agenda-contatos-detalhes.component.scss']
})
export class AgendaContatosDetalhesComponent implements OnInit {

  formCliente: FormGroup;
  formPets: FormGroup;
  cepEncontrado: boolean = false;
  petCaracteristicas: IPetCaracteristica[];
  clienteId: string;

  constructor(private formBuilder: FormBuilder,
              private empresaService: EmpresaService,
              private consultaCepService: ConsultaCepService,
              private clienteService: ClienteService,
              private snackbarService: SnackbarService,
              private location: Location,
              private activatedRoute: ActivatedRoute) {
                this.clienteId = this.activatedRoute.snapshot.params.id;
              }

  ngOnInit(): void {
    this.carregarFormCliente();
    this.obterPetCaracteristicas();
  }

  private obterPetCaracteristicas() {
    this.empresaService.obterTodosPetCaracteristicas().subscribe((res: IPetCaracteristica[]) => {
      this.petCaracteristicas = res;
    });
  }

  private carregarFormCliente() {
    this.formCliente = this.formBuilder.group({
      id: [''],
      whatsApp: ['', Validators.required],
      nome: ['', Validators.required],

      endereco: this.formBuilder.group({
        cep: [''],
        numero: [''],
        complemento: [''],
        logradouro: [''],
        bairro: [''],
        cidade: [''],
        estado: ['']
      }),

      pet: this.formBuilder.group({
        tipoPet: ['', Validators.required],
        nome: ['', Validators.required],
        idPetCaracteristica: ['', Validators.required]
      })
    });

    this.carregarClienteParaEditar();
  }

  private carregarClienteParaEditar() {
    if(this.clienteId == undefined) return;

    this.clienteService.obterClientePorId(this.clienteId).subscribe((res: ICliente) => {
      if(!res.id) return;

      this.formCliente.patchValue(res);
    });
  }

  avancarStep(stepper: MatStepper){
    if(this.formCliente.get('whatsApp').invalid || this.formCliente.get('nome').invalid || this.formCliente.controls.endereco.invalid) return;

    stepper.next();
  }

  buscarCep(){
    let cep = this.formCliente.controls.endereco.get('cep');
    if(cep.invalid) return;

    this.consultaCepService.consultarCEP(cep.value).subscribe(res => {
      if(res.erro)
      {
        this.resetarEnderecoForm();
        return;
      }

      this.popularEndereco(res);
    })
  }

  popularEndereco(dados: IConsultaCep) {
    this.cepEncontrado = true;

    this.formCliente.controls.endereco.patchValue({
      numero: '',
      complemento: dados.complemento,
      logradouro: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf
    });
  }

  resetarEnderecoForm() {
    this.cepEncontrado = false;
    this.formCliente.controls.endereco.setErrors({'incorreto': true});
    this.formCliente.controls.endereco.patchValue({
      numero: '',
      complemento: '',
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
  }

  adicionarOuAlterarContato(){
    if(this.formCliente.invalid) return;

    this.clienteId == undefined ? this.adicionarCliente() : this.alterarCliente();
  }

  adicionarCliente() {
    this.clienteService.adicionarCliente(this.formCliente.getRawValue()).subscribe(res => {
      if (res.sucesso){
        this.snackbarService.abrirMensagemSucesso("Contato adicionado com sucesso");
        setTimeout(() => {
          this.location.back();
        }, 100);
      }
      else
        this.snackbarService.abrirMensagemErro("Ocorreu um erro ao adicionar contato");
    });
  }

  alterarCliente() {
    this.clienteService.alterarCliente(this.formCliente.getRawValue()).subscribe(res => {
      if (res.sucesso){
        this.snackbarService.abrirMensagemSucesso("Contato atualizado com sucesso");
        setTimeout(() => {
          this.location.back();
        }, 100);
      }
      else
        this.snackbarService.abrirMensagemErro("Ocorreu um erro ao alterar o contato");
    });
  }
}
