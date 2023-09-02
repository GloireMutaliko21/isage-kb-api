import { Module } from '@nestjs/common';
import { InventaireService } from './inventaire.service';
import { InventaireController } from './inventaire.controller';

@Module({
  providers: [InventaireService],
  controllers: [InventaireController]
})
export class InventaireModule {}
