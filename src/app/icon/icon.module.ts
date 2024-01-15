import { Module } from '@nestjs/common';
import { IconController } from './icon.controller';
import { IconService } from './icon.service';

@Module({
  controllers: [IconController],
  providers: [IconService]
})
export class IconModule {}
