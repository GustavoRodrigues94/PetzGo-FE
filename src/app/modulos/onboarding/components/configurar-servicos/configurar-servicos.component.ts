
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { IServicoPetCaracteristica } from 'src/app/interfaces/IServicoPetCaracteristica';

@Component({
  selector: 'app-configurar-servicos',
  templateUrl: './configurar-servicos.component.html',
  styleUrls: ['./configurar-servicos.component.scss']
})
export class ConfigurarServicosComponent implements OnInit {
  titulo: string;
  servicoPetCaracteristica: IServicoPetCaracteristica[];
  dataSource: MatTableDataSource<IServicoPetCaracteristica>;
  exibicaoColunas: string[] = ['selecao', 'petCaracteristica', 'valor', 'tempo'];
  selecao: SelectionModel<IServicoPetCaracteristica>;

  constructor(
      public dialogRef: MatDialogRef<ConfigurarServicosComponent>,
      private readonly changeDetectorRef: ChangeDetectorRef,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.obterTitulo(data.tipoPet, data.nomeServico);
        this.servicoPetCaracteristica = data.petCaracteristicas;
      }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IServicoPetCaracteristica>(this.servicoPetCaracteristica);
    this.selecao = new SelectionModel<IServicoPetCaracteristica>(true, []);
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  obterTitulo(tipoPet: number, nomeServico: string) {
    this.titulo = tipoPet == 0 ? "Cachorro" : "Gato";
    this.titulo += ` - ${nomeServico}`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isAllSelected() {
    const numSelected = this.selecao.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
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

  edit(event, element) {
    element.selecao = !element.selecao;
  }

  confirmar(form: NgForm){
    if(!form.valid) return;

    let petCaracteristicasPreenchidos = this.dataSource.data?.filter(x => x.selecao);

    this.dialogRef.close(petCaracteristicasPreenchidos);
  }

}

