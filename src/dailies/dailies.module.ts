import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dailies } from 'src/entities/dailies.entity';
import { DailiesController } from './dailies.controller';
import { DailiesService } from './dailies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dailies])],
  controllers: [DailiesController],
  providers: [DailiesService],
})
export class DailiesModule {}
