import { IUsuario } from './../../interfaces/IUsuario';
import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {

  usuario: IUsuario;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.obterUsuarioLogado;
  }

  deslogar(){
    this.usuarioService.deslogar();
  }

}
