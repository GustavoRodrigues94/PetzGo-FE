import { IEndereco } from './IEndereco';

export interface ICliente {
  id: string,
  nome: string,
  whatsapp: string
  endereco: IEndereco
}
