import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Senha precisa ter ao menos 8 caracteres' })
  @Matches(/(?=.*[a-zA-Z])(?=.*\d)/, {
    message: 'Senha precisa conter ao menos uma letra e um numero',
  })
  senha: string;

  @IsOptional()
  @IsString()
  telefone?: string;
}
