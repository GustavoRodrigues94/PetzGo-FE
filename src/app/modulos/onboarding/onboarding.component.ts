

import { ConfigurarServicosComponent } from './components/configurar-servicos/configurar-servicos.component';
import { SnackbarService } from '../../services/snackbar.service';
import { EmpresaService } from '../../services/empresa.service';
import { ICriarEmpresaComando, ICriarEmpresaPrimeiraEtapaComando, ICriarEmpresaSegundaEtapaComando, ICriarEmpresaTerceiraEtapaComando, ICriarEmpresaQuartaEtapaComando, ICriarEmpresaQuintaEtapaComando } from '../../interfaces/ICriarEmpresaComando';
import { ConsultaCepService } from '../../services/consulta-cep.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CpfCnpjValidator } from 'src/app/compartilhado/validacoes/cpf-cnpj-validator';
import { IConsultaCep } from 'src/app/interfaces/IConsultaCep';
import { SpinnerService } from 'src/app/services/spinner.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { ITipoNegocio } from 'src/app/interfaces/ITipoNegocio';
import { IServico } from 'src/app/interfaces/IServico';
import { IHorario } from 'src/app/interfaces/IHorario';
import { IServicoPetCaracteristica } from 'src/app/interfaces/IServicoPetCaracteristica';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  primeiroStep: FormGroup;
  segundoStep: FormGroup;
  terceiroStep: FormGroup;
  quartoStep: FormGroup;
  quintoStep: FormGroup;
  tiposNegocios: ITipoNegocio[];
  servicos: IServico[];
  criarEmpresaTerceiraEtapaComando: ICriarEmpresaTerceiraEtapaComando[] = [];

  exibicaoColunas: string[] = ['selecao', 'diaSemana', 'horaInicio', 'horaFim'];
  dataSource = new MatTableDataSource<IHorario>();
  selecao = new SelectionModel<IHorario>(true, []);

  cepEncontrado: boolean;
  esconderSenha: boolean = true;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private consultaCepService: ConsultaCepService,
              private empresaService: EmpresaService,
              private spinnerService : SpinnerService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.spinnerService.exibirSpinner();
    this.carregarFormulario();
    this.obterTiposNegocios();
    this.obterTodosServicos();
    this.obterTodosDiasSemana();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  obterTodosDiasSemana() {
    this.empresaService.obterTodosDiasSemana().subscribe((res: IHorario[]) => {
      this.dataSource.data = res;
      this.adicionarHorariosPadrao(this.dataSource.data);
      this.spinnerService.pararSpinner();
    }), () => {
      this.spinnerService.pararSpinner();
    };
  }

  adicionarHorariosPadrao(data: IHorario[]) {
    data.forEach(x => {
      if(this.verificarSeDiaDaSemana(x))
      {
        this.selecao.select(x);
        x.horaInicio = "08:00";
        x.horaFim = "18:00";
        x.selecao = true;
      }
      else if(x.diaSemana == "Sábado"){
        this.selecao.select(x);
        x.horaInicio = "08:00";
        x.horaFim = "12:00";
        x.selecao = true
      };
    });
  }

  private verificarSeDiaDaSemana(x: IHorario) {
    return x.diaSemana == "Segunda-feira" ||
            x.diaSemana == "Terça-feira"  ||
            x.diaSemana == "Quarta-feira" ||
            x.diaSemana == "Quinta-feira" ||
            x.diaSemana == "Sexta-feira";
  }

  obterTodosServicos() {
    this.empresaService.obterTodosServicos().subscribe((res: IServico[]) => {
      this.servicos = res;
    }), () => {
      this.spinnerService.pararSpinner();
    };
  }

  obterTiposNegocios() {
    this.empresaService.obterTodosTiposNegocios().subscribe((res: ITipoNegocio[]) => {
      this.tiposNegocios = res;
    }), () => {
      this.spinnerService.pararSpinner();
    };
  }

  private carregarFormulario() {
    this.primeiroStep = this.formBuilder.group({
      tipoNegocioId: ['', Validators.required],
      nomeFantasia: ['', Validators.required],
      whatsApp: ['', [Validators.required, Validators.minLength(10)]],
      cnpj: ['', [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(14),
        CpfCnpjValidator.validate,
      ]],
      razaoSocial: ['', Validators.required],
      rotuloLink: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()]+$/)]]
    });

    this.segundoStep = this.formBuilder.group({
      cep: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      numero: ['', Validators.required],
      complemento: [''],
      rua: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required]
    });

    this.terceiroStep = this.formBuilder.group({
      servicosCachorro: [this.criarEmpresaTerceiraEtapaComando, [Validators.required, Validators.minLength(2)]],
      servicosGato: [this.criarEmpresaTerceiraEtapaComando]
    });

    this.quartoStep = this.formBuilder.group({});

    this.quintoStep = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  buscarCep(){
    let cep = this.segundoStep.get('cep');
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

    this.segundoStep.patchValue({
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
    this.segundoStep.get('cep').setErrors({'incorreto': true});
    this.segundoStep.patchValue({
      numero: '',
      complemento: '',
      rua: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
  }

  montarRotuloLink(){
    let nomeFantasia = this.primeiroStep.get('nomeFantasia').value.replace(/[^a-zA-Z0-9]/g, '').replace(/ /g, ";").toLowerCase();

    this.primeiroStep.patchValue({
      rotuloLink: nomeFantasia
    })
  }

  selecionarServico(evento, tipoPet: number){
    if(!evento.option.selected) return;


    this.abrirPetCaracteristicas(tipoPet, evento);
   }

   async abrirPetCaracteristicas(tipoPet: number, evento: any): Promise<void> {
    this.obterPetCaracteristicasPorServicoId(tipoPet, evento);
  }

  obterPetCaracteristicasPorServicoId(tipoPet: number, evento: any) {
    this.spinnerService.exibirSpinner();

    let servicoId = evento.option.value;
    let nomeServico = evento.option._text.nativeElement.innerText;
    this.empresaService.obterPetCaracteristicasPorServicoId(servicoId).subscribe((res: IServicoPetCaracteristica[]) => {
      this.spinnerService.pararSpinner();

      this.abrirModalPetCaracteristicas(tipoPet, servicoId, nomeServico, res, evento);

      this.spinnerService.pararSpinner();
    }, () => {
        this.spinnerService.pararSpinner();
        evento.option.selected = false;
    });
  }

  private abrirModalPetCaracteristicas(tipoPet: number, servicoId: string, nomeServico: string, res: IServicoPetCaracteristica[], evento: any) {
    const dialogRef = this.dialog.open(ConfigurarServicosComponent, {
      disableClose: true,
      panelClass: "dialog-responsive",
      data: { tipoPet: tipoPet, servicoId: servicoId, nomeServico: nomeServico, petCaracteristicas: res }
    });

    dialogRef.afterClosed().subscribe((result: IServicoPetCaracteristica[]) => {
      if(result == undefined){
        evento.option.selected = false;
        return;
      }

      this.adicionarServicoPetCaracteristica(tipoPet, result);
    });
  }

  adicionarServicoPetCaracteristica(tipoPet: number, servicoPetCaracteristica: IServicoPetCaracteristica[]) {
    servicoPetCaracteristica.forEach(item => {
      const servicoPetCaracteristicaParaAdicionar = {
        servicoPetCaracteristicaId: item.id,
        tipoPet: tipoPet,
        valor: item.valor,
        tempo: item.tempo
      };

      this.criarEmpresaTerceiraEtapaComando.push(servicoPetCaracteristicaParaAdicionar);
    });
  }

  verificarSeTodosSelecionados() {
    const numSelected = this.selecao.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  selecionarTodos() {
    this.verificarSeTodosSelecionados() ?
        this.limparSelecao() :
        this.dataSource.data.forEach(row => {
          this.selecao.select(row);
          row.selecao = true;
        });
  }

  private limparSelecao() {
    this.selecao.clear();
    this.dataSource.data.forEach(row => {
      row.selecao = false;
    });
  }

  selecionarRow(event, element) {
    element.selecao = !element.selecao;
    if(!element.selecao){
      element.horaInicio = "";
      element.horaFim = "";
    }
  }

  criarEmpresa(){
    if(this.primeiroStep.invalid || this.segundoStep.invalid || this.terceiroStep.invalid) return;

    this.spinnerService.exibirSpinner();
    let primeraEtapa = this.primeiroStep.getRawValue() as ICriarEmpresaPrimeiraEtapaComando;
    let segundaEtapa = this.segundoStep.getRawValue() as ICriarEmpresaSegundaEtapaComando;
    let terceiraEtapa = this.criarEmpresaTerceiraEtapaComando as ICriarEmpresaTerceiraEtapaComando[];
    let quartaEtapa = this.dataSource.data.filter(x => x.selecao) as ICriarEmpresaQuartaEtapaComando[];
    let quintaEtapa = this.quintoStep.getRawValue() as ICriarEmpresaQuintaEtapaComando;

    let criarEmpresaComando: ICriarEmpresaComando = {
      primeiraEtapaComando: primeraEtapa,
      segundaEtapaComando: segundaEtapa,
      terceiraEtapaComando: terceiraEtapa,
      quartaEtapaComando: quartaEtapa,
      quintaEtapaComando: quintaEtapa
    };

    this.empresaService.criarEmpresa(criarEmpresaComando).subscribe(res => {
      this.spinnerService.pararSpinner();
      if(res.sucesso){
        this.snackbarService.abrirMensagemSucesso('Aguarde que iremos lhe redirecionar...');
      }
      else{
        this.snackbarService.abrirMensagemInformacao(res.mensagem);
      }
    }, () => {
        this.spinnerService.pararSpinner();
    });
  }
}

