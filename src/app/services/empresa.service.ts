
import { IComandoResultado } from '../interfaces/IComandoResultado';
import { ICriarEmpresaComando } from '../interfaces/ICriarEmpresaComando';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ITipoNegocio } from '../interfaces/ITipoNegocio';
import { IServico } from '../interfaces/IServico';
import { IHorario } from '../interfaces/IHorario';
import { IServicoPetCaracteristica } from '../interfaces/IServicoPetCaracteristica';
import { IPetCaracteristica } from '../interfaces/IPetCaracteristica';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = `${environment.urlBase}/empresa`;

  constructor(private http: HttpClient,
              private usuarioService: UsuarioService) { }

  public criarEmpresa(criarEmpresaComando: ICriarEmpresaComando): Observable<IComandoResultado> {
    return this.http.post<IComandoResultado>(this.apiUrl, criarEmpresaComando)
      .pipe(
        catchError(this.handleError)
      );
  }

  public obterTodosTiposNegocios(): Observable<ITipoNegocio[]> {
    return this.http.get<ITipoNegocio[]>(`${this.apiUrl}/tipos-negocios/todos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  public obterTodosServicos(): Observable<IServico[]> {
    return this.http.get<IServico[]>(`${this.apiUrl}/servicos/todos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  obterServicoEmpresaPetCaracteristica(servicoId: string, idPetCaracteristica: string) : Observable<IServicoPetCaracteristica> {
    return this.http.get<IServicoPetCaracteristica>(`${this.apiUrl}/servicos/${this.usuarioService.obterEmpresaIdUsuarioLogado}/${servicoId}/${idPetCaracteristica}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  public obterTodosDiasSemana() : Observable<IHorario[]> {
    return this.http.get<IHorario[]>(`${this.apiUrl}/dias-semana/todos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  public obterPetCaracteristicasPorServicoId(servicoId: string): Observable<IServicoPetCaracteristica[]> {
    return this.http.get<IServicoPetCaracteristica[]>(`${this.apiUrl}/servicos/${servicoId}/caracteristicas`)
      .pipe(
        catchError(this.handleError)
      );
  }

  obterTodosPetCaracteristicas() : Observable<IPetCaracteristica[]>{
    return this.http.get<IPetCaracteristica[]>(`${this.apiUrl}/pet-caracteristicas/todos`)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(errorResponse: Response) {
    console.log(errorResponse.statusText);
    return throwError(errorResponse || 'Server error');
  }
}
