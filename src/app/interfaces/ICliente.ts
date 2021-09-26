import { IEndereco } from './IEndereco';
import { IPet } from './IPet';

export interface ICliente {
  id: string,
  empresaId: string,
  nome: string,
  whatsapp: string,
  endereco: IEndereco,
  pet: IPet
}
