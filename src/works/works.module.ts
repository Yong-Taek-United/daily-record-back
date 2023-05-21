import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Works } from 'src/entities/works.entity';
import { WorksController } from './works.controller';
import { WorksService } from './works.service';

@Module({
  imports: [TypeOrmModule.forFeature([Works])],
  controllers: [WorksController],
  providers: [WorksService]
})
export class WorksModule {}
