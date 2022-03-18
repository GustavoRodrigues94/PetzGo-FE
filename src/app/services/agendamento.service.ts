import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAdicionarAgendamentoComando } from '../interfaces/IAdicionarAgendamentoComando';
import { IComandoResultado } from '../interfaces/IComandoResultado';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private apiUrl = `${environment.urlBase}/agendamento`;

  constructor(private http: HttpClient,
    private usuarioService: UsuarioService) { }

    adicionarAgendamento(adicionarAgendamentoComando: IAdicionarAgendamentoComando): Observable<IComandoResultado> {
      adicionarAgendamentoComando.empresaId = this.usuarioService.obterEmpresaIdUsuarioLogado;

      return this.http.post<IComandoResultado>(this.apiUrl, adicionarAgendamentoComando)
        .pipe(
          catchError(this.handleError)
        );
    }

    private handleError(errorResponse: Response) {
      console.log(errorResponse.statusText);
      return throwError(errorResponse || 'Server error');
    }
}
