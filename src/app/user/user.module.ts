import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/shared/entities/user.entity';
import { UserFile } from 'src/shared/entities/userFile.entity';
import { UserProfile } from 'src/shared/entities/userProfile.entity';
import { EmailLog } from 'src/shared/entities/emailLog.entity';
import { AuthModule } from 'src/app/auth/auth.module';
import { EmailModule } from 'src/app/email/email.module';
import { UserHelperService } from 'src/shared/services/user-helper.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfig } from 'src/shared/configs/multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserFile, UserProfile, EmailLog]),
    JwtModule,
    MulterModule.registerAsync({
      useClass: MulterConfig,
    }),
    forwardRef(() => AuthModule),
    forwardRef(() => EmailModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserHelperService],
  exports: [UserHelperService],
})
export class UserModule {}
