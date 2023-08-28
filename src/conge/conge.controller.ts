import { Controller, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../roles/guards';
import { CongeService } from './conge.service';

@UseGuards(JwtGuard, RolesGuard)
@Controller('conge')
export class CongeController {
  constructor(private readonly congeService: CongeService) {}
}
