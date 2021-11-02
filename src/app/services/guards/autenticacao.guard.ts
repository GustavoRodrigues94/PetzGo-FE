
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RotasPaginas } from 'src/app/compartilhado/enums/rotas.enum';
import { UsuarioService } from '../usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoGuard implements CanActivate {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.usuarioService.logado) {
        let usuario = this.usuarioService.obterUsuarioLogado;
        let empresaId = route.url[0]?.path;

        if(usuario.empresaId !== undefined && empresaId == undefined)
        {
          this.router.navigate([usuario.empresaId]);
          return true;
        }

        if(usuario.empresaId !== empresaId){
          this.router.navigate([RotasPaginas.Login]);
          return false;
        }

        return true;
      }

      this.router.navigate([RotasPaginas.Login]);
      return false;
    }

}
