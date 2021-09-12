import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IConsultaCep } from '../interfaces/IConsultaCep';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(private http: HttpClient) { }

  consultarCEP(cep: string) : Observable<IConsultaCep> {
    cep = cep.replace(/\D/g, '');

    if (cep !== '') {
      const validacep = /^[0-9]{8}$/;

      if (validacep.test(cep)) {
        return this.http.get<IConsultaCep>(`//viacep.com.br/ws/${cep}/json`);
      }
    }
  }
}
