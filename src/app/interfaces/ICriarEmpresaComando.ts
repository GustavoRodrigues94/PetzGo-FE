export interface ICriarEmpresaComando{
  empresa: IEmpresa,
  endereco: IEndereco,
  login: ILogin,
}

export interface IEmpresa{
  tipoNegocioId: string,
  nomeFantasia: string,
  whatsApp: string,
  cnpj: string,
  razaoSocial: string,
  rotuloLink: string
}

export interface IEndereco {
  cep: string,
  logradouro: string,
  numero: string,
  bairro: string,
  complemento: string,
  cidade: string,
  estado: string
}

export interface ILogin {
  email: string,
  senha: string
}
