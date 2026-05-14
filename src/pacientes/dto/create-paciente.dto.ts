import { IsDateString, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePacienteDto {
  @IsString()
  @MinLength(2)
  nome: string;

  @IsDateString()
  dataNascimento: string;

  @IsOptional()
  @IsIn(['M', 'F', 'O'])
  sexo?: 'M' | 'F' | 'O';

  @IsOptional()
  @IsString()
  observacoes?: string;
}
