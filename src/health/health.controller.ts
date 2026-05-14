import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @SkipThrottle()
  @Get()
  check() {
    return {
      status: 'ok',
      ts: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
