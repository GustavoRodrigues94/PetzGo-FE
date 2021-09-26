import { RotasPaginas } from './../compartilhado/enums/rotas.enum';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IComandoResultado } from "../interfaces/IComandoResultado";
import { IUsuario } from "../interfaces/IUsuario";
import jwtDecode, * as jwt_decode from 'jwt-decode';

const tokenConstante = "3c469e9d6c5875d37a43f353d4f88e61fcf812c66eee3457465a40b0da4153e0";
const usuarioConstante = "9250e222c4c71f0c58d4c54b50a880a312e9f9fed55d5c3aa0b0e860ded99165";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.urlBase}/usuario`;

  constructor(private httpClient: HttpClient,
              private router: Router) { }

  logar(usuario: IUsuario) : Observable<IComandoResultado> {
    return this.httpClient.post<IComandoResultado>(`${this.apiUrl}/admin/autenticar`, usuario).pipe(
      tap((resposta) => {
        if(!resposta.sucesso) return;

        localStorage.setItem(tokenConstante, btoa(JSON.stringify(resposta.dado['token'])));
        localStorage.setItem(usuarioConstante, btoa(JSON.stringify(resposta.dado['usuario'])));

        this.router.navigate([resposta.dado['usuario'].empresaRotuloLink]);
      }));
  }

  deslogar() {
      localStorage.clear();
      this.router.navigate([RotasPaginas.Login]);
  }

  get obterUsuarioLogado(): IUsuario {
    return localStorage.getItem(usuarioConstante)
      ? JSON.parse(atob(localStorage.getItem(usuarioConstante)))
      : null;
  }

  get obterIdUsuarioLogado(): string {
    return localStorage.getItem(usuarioConstante)
      ? (JSON.parse(atob(localStorage.getItem(usuarioConstante))) as IUsuario).id
      : null;
  }

  get obterEmpresaIdUsuarioLogado(): string {
    return localStorage.getItem(usuarioConstante)
      ? (JSON.parse(atob(localStorage.getItem(usuarioConstante))) as IUsuario).empresaId
      : null;
  }

  get obterTokenUsuario(): string {
    return localStorage.getItem(tokenConstante)
      ? JSON.parse(atob(localStorage.getItem(tokenConstante)))
      : null;
  }

  get logado(): boolean {
    let token = this.decodificarTokenJwt;
    let usuario = this.obterUsuarioLogado;
    if(token == null || usuario == null) return false;

    return token.unique_name == usuario.id ? true : false;
  }

  private get decodificarTokenJwt(): any {
    try {
      let token = this.obterTokenUsuario;
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }
}
