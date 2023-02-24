import { Module } from '@nestjs/common';
import { DailiesController } from './dailies.controller';
import { DailiesService } from './dailies.service';

@Module({
  controllers: [DailiesController],
  providers: [DailiesService]
})
export class DailiesModule {}
