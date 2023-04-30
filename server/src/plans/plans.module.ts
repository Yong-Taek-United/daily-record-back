import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plans } from 'src/entities/plans.entity';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plans])],
  controllers: [PlansController],
  providers: [PlansService]
})
export class PlansModule {}
