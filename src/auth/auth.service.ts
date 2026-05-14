import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Responsavel } from '../responsaveis/responsavel.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Responsavel)
    private readonly responsaveis: Repository<Responsavel>,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existe = await this.responsaveis.findOne({
      where: { email: dto.email },
    });
    if (existe) throw new ConflictException('Email ja cadastrado');

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const responsavel = this.responsaveis.create({
      nome: dto.nome,
      email: dto.email,
      telefone: dto.telefone,
      senhaHash,
    });
    await this.responsaveis.save(responsavel);
    return this.signFor(responsavel);
  }

  async login(dto: LoginDto) {
    const r = await this.responsaveis.findOne({ where: { email: dto.email } });
    if (!r) throw new UnauthorizedException('Credenciais invalidas');

    const ok = await bcrypt.compare(dto.senha, r.senhaHash);
    if (!ok) throw new UnauthorizedException('Credenciais invalidas');

    return this.signFor(r);
  }

  async me(id: string) {
    const r = await this.responsaveis.findOne({ where: { id } });
    if (!r) throw new UnauthorizedException();
    return {
      id: r.id,
      nome: r.nome,
      email: r.email,
      telefone: r.telefone,
      criadoEm: r.criadoEm,
    };
  }

  private signFor(r: Responsavel) {
    const accessToken = this.jwt.sign({ sub: r.id, email: r.email });
    return {
      accessToken,
      responsavel: {
        id: r.id,
        nome: r.nome,
        email: r.email,
      },
    };
  }
}
