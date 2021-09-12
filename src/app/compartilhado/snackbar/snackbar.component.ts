import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

  ngOnInit() {
  }

  get getIcon() {
    switch (this.data.snackType) {
      case 'sucesso':
        return 'check_circle';
      case 'erro':
        return 'report';
      case 'atencao':
        return 'warning';
      case 'informacao':
        return 'info';
    }
  }

  fecharSnackbar() {
    this.data.snackBar.dismiss();
  }

}
