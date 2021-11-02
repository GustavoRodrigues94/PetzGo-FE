import { IUsuario } from './../../interfaces/IUsuario';
import { UsuarioService } from './../../services/usuario.service';
import { SnackbarService } from '../../services/snackbar.service';
import { EmpresaService } from '../../services/empresa.service';
import { ICriarEmpresaComando, IEmpresa, IEndereco, ILogin } from '../../interfaces/ICriarEmpresaComando';
import { ConsultaCepService } from '../../services/consulta-cep.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CpfCnpjValidator } from 'src/app/compartilhado/validacoes/cpf-cnpj-validator';
import { IConsultaCep } from 'src/app/interfaces/IConsultaCep';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ITipoNegocio } from 'src/app/interfaces/ITipoNegocio';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  empresa: FormGroup;
  endereco: FormGroup;
  login: FormGroup;
  tiposNegocios: Observable<ITipoNegocio[]>;
  cepEncontrado: boolean;
  esconderSenha: boolean = true;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private spinnerService : SpinnerService,
              private snackbarService: SnackbarService,
              private consultaCepService: ConsultaCepService,
              private empresaService: EmpresaService,
              private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.spinnerService.exibirSpinner();
    this.carregarFormulario();
    this.obterTiposNegocios();
    this.spinnerService.pararSpinner();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  obterTiposNegocios() {
    this.tiposNegocios = this.empresaService.obterTodosTiposNegocios();
  }

  private carregarFormulario() {
    this.empresa = this.formBuilder.group({
      tipoNegocioId: ['', Validators.required],
      nomeFantasia: ['', Validators.required],
      whatsApp: ['', [Validators.required, Validators.minLength(10)]],
      cnpj: ['', [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(14),
        CpfCnpjValidator.validate,
      ]],
    });

    this.endereco = this.formBuilder.group({
      cep: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      numero: ['', Validators.required],
      complemento: [''],
      rua: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required]
    });

    this.login = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  buscarCep(){
    let cep = this.endereco.get('cep');
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

    this.endereco.patchValue({
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
    this.endereco.get('cep').setErrors({'incorreto': true});
    this.endereco.patchValue({
      numero: '',
      complemento: '',
      rua: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
  }

  criarEmpresa(){
    if(this.empresa.invalid || this.endereco.invalid || this.login.invalid) return;

    this.spinnerService.exibirSpinner();
    let criarEmpresaComando: ICriarEmpresaComando = {
      empresa: this.empresa.getRawValue() as IEmpresa,
      endereco: this.endereco.getRawValue() as IEndereco,
      login: this.login.getRawValue() as ILogin,
    };

    this.empresaService.criarEmpresa(criarEmpresaComando).subscribe(res => {
      this.spinnerService.pararSpinner();
      if(res.sucesso){
        this.snackbarService.abrirMensagemSucesso('Aguarde que iremos lhe redirecionar...');
        setTimeout(() => {
          this.usuarioService.logar(criarEmpresaComando.login as IUsuario).toPromise();
        }, 500);
      }
      else{
        this.snackbarService.abrirMensagemInformacao(res.mensagem);
      }
    }, () => {
        this.spinnerService.pararSpinner();
    });
  }
}

