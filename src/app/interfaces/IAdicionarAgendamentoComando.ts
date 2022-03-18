export interface IAdicionarAgendamentoComando {
  empresaId: string,
  clienteId: string,
  servicoId: string,
  dataHoraInicio: Date,
  tempoEmMinutos: number,
  valorServico: number
}
