import { SnackbarService } from './../../services/snackbar.service';
import { SpinnerService } from './../../services/spinner.service';
import { IComandoResultado } from './../../interfaces/IComandoResultado';
import { IUsuario } from './../../interfaces/IUsuario';
import { UsuarioService } from './../../services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoginEtapa } from './enums/login-etapa.enum';

@Component({
  selector: 'app-autenticacao',
  templateUrl: './autenticacao.component.html',
  styleUrls: ['./autenticacao.component.scss']
})
export class AutenticacaoComponent implements OnInit {

  formLogin: FormGroup;
  loginEtapa: LoginEtapa = 0;
  esconderSenha: boolean = true;

  constructor(private formBuilder: FormBuilder,
              private usuarioService: UsuarioService,
              private spinnerService: SpinnerService,
              private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.criarForm();
  }

  criarForm() {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  avancarLogin(){
    if(this.loginEtapa == LoginEtapa.InformandoEmail)
    {
      if(this.formLogin.get('email').invalid) return;
      this.loginEtapa = LoginEtapa.InformandoSenha;
    }
    else if(this.loginEtapa == LoginEtapa.InformandoSenha){
      if(this.formLogin.get('senha').invalid) return;

      this.logar();
    }
  }

  logar() {
    this.spinnerService.exibirSpinner();

    let usuario = this.formLogin.getRawValue() as IUsuario;
    this.usuarioService.logar(usuario).subscribe((res: IComandoResultado) => {
      if(!res.sucesso)
        this.snackbarService.abrirMensagemAtencao("E-mail e/ou senha inválidos");

      this.spinnerService.pararSpinner();
    }, (error) => {
      this.snackbarService.abrirMensagemErro("Ocorreu um erro ao autenticar");
      this.spinnerService.pararSpinner();
    })
  }

  voltarLogin(){
    this.loginEtapa = LoginEtapa.InformandoEmail;
  }

}
