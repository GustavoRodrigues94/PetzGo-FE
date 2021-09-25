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

@Component({
  selector: 'agenda-contatos-detalhes',
  templateUrl: './agenda-contatos-detalhes.component.html',
  styleUrls: ['./agenda-contatos-detalhes.component.scss']
})
export class AgendaContatosDetalhesComponent implements OnInit {

  formCliente: FormGroup;
  formPets: FormGroup;
  cepEncontrado: boolean = false;
  petCaracteristicas: IPetCaracteristica[] = [];
  petCaracteristicasAutoComplete: Observable<IPetCaracteristica[]>;
  petCaracteristicaFormControlAutoComplete = new FormControl();

  constructor(private formBuilder: FormBuilder,
              private empresaService: EmpresaService,
              private consultaCepService: ConsultaCepService) { }

  ngOnInit(): void {
    this.carregarFormCliente();
    this.obterPetCaracteristicas();
    this.carregarPetCaracteristicasAutoComplete();
  }

  private carregarPetCaracteristicasAutoComplete() {
    this.petCaracteristicasAutoComplete = this.petCaracteristicaFormControlAutoComplete.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filtrarPetCaracteristica(name) : this.petCaracteristicas.slice())
      );
  }

  private filtrarPetCaracteristica(value: string): IPetCaracteristica[] {
    const filterValue = value.toLowerCase();
    return this.petCaracteristicas.filter(option => option.petCaracteristica.toLowerCase().includes(filterValue));
  }

  exibirAutoComplete(petCaracteristica: IPetCaracteristica): string {
    return petCaracteristica && petCaracteristica.petCaracteristica ? petCaracteristica.petCaracteristica : '';
  }

  private obterPetCaracteristicas() {
    this.empresaService.obterTodosPetCaracteristicas().subscribe((res: IPetCaracteristica[]) => {
      this.petCaracteristicas = res;
      console.log(res);
    });
  }

  private carregarFormCliente() {
    this.formCliente = this.formBuilder.group({
      whatsApp: ['', Validators.required],
      nome: ['', Validators.required],

      endereco: this.formBuilder.group({
        cep: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
        numero: ['', Validators.required],
        complemento: [''],
        rua: ['', Validators.required],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', Validators.required]
      }),

      pet: this.formBuilder.group({
        tipoPet: ['', Validators.required],
        nome: ['', Validators.required],
        idPetCaracteristica: ['', Validators.required]
      })

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
      rua: dados.logradouro,
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
      rua: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
  }

  adicionarContato(){
    this.formCliente.controls.pet.patchValue({
      idPetCaracteristica: this.petCaracteristicaFormControlAutoComplete?.value?.id
    });

    if(this.formCliente.invalid) return;

    let cliente = this.formCliente.getRawValue() as ICliente;

    console.log(cliente);
  }

}