import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../compartilhado/components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

constructor(private snackBar: MatSnackBar) { }

  abrirMensagemSucesso(mensagem: string){
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: { message: mensagem, snackType: 'sucesso', snackBar: this.snackBar },
      panelClass: ["snackbar-sucesso"]
    });
  }

  abrirMensagemErro(mensagem: string){
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: { message: mensagem, snackType: 'erro', snackBar: this.snackBar },
      panelClass: ["snackbar-erro"]
    });
  }

  abrirMensagemInformacao(mensagem: string){
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: { message: mensagem, snackType: 'informacao', snackBar: this.snackBar },
      panelClass: ["snackbar-informacao"]
    });
  }

  abrirMensagemAtencao(mensagem: string){
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: { message: mensagem, snackType: 'atencao', snackBar: this.snackBar },
      panelClass: ["snackbar-atencao"]
    });
  }
}
