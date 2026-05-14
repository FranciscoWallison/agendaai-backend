import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAgendamentoDto {
  @IsUUID()
  pacienteId: string;

  @IsUUID()
  profissionalId: string;

  @IsUUID()
  servicoId: string;

  @IsDateString()
  dataHoraInicio: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
