export interface ICriarEmpresaComando{
  primeiraEtapaComando: ICriarEmpresaPrimeiraEtapaComando,
  segundaEtapaComando: ICriarEmpresaSegundaEtapaComando,
  terceiraEtapaComando: ICriarEmpresaTerceiraEtapaComando[],
  quartaEtapaComando: ICriarEmpresaQuartaEtapaComando[],
  quintaEtapaComando: ICriarEmpresaQuintaEtapaComando
}

export interface ICriarEmpresaPrimeiraEtapaComando{
  tipoNegocioId: string,
  nomeFantasia: string,
  whatsApp: string,
  cnpj: string,
  razaoSocial: string,
  rotuloLink: string
}

export interface ICriarEmpresaSegundaEtapaComando {
  cep: string,
  logradouro: string,
  numero: string,
  bairro: string,
  complemento: string,
  cidade: string,
  estado: string
}

export interface ICriarEmpresaTerceiraEtapaComando {
  servicoPetCaracteristicaId: string,
  tipoPet: number,
  valor: number,
  tempo: number
}

export interface ICriarEmpresaQuartaEtapaComando {
  id: string,
  horaInicio: string,
  horaFim: string
}

export interface ICriarEmpresaQuintaEtapaComando {
  email: string,
  senha: string
}
