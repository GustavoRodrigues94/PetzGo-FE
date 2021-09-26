import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ICliente } from '../interfaces/ICliente';
import { IComandoResultado } from '../interfaces/IComandoResultado';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${environment.urlBase}/cliente`;

  constructor(private http: HttpClient,
              private usuarioService: UsuarioService) { }

  public adicionarCliente(cliente: ICliente): Observable<IComandoResultado> {
    return this.http.post<IComandoResultado>(this.apiUrl, cliente)
      .pipe(
        catchError(this.handleError)
      );
  }

  public obterClientes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${this.usuarioService.obterEmpresaIdUsuarioLogado}/todos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  public desativarAtivarCliente(clienteId: string, ativo: boolean) : Observable<IComandoResultado>{
    let cliente = {
      empresaId: this.usuarioService.obterEmpresaIdUsuarioLogado,
      clienteId: clienteId,
      ativo: ativo
    }

    return this.http.patch<IComandoResultado>(`${this.apiUrl}`, cliente)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(errorResponse: Response) {
    console.log(errorResponse.statusText);
    return throwError(errorResponse || 'Server error');
  }

}
