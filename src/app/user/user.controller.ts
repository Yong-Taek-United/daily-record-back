import { Body, Controller, Delete, Get, Patch, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from './user.service';
import {
  CreateUserDto,
  DeleteUserDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UpdateUserBasicDto,
  UpdateUserProfileDto,
} from '../../shared/dto/user.dto';
import { Public } from 'src/shared/decorators/skip-auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  @Public()
  @ApiOperation({ summary: '회원가입: 일반', description: 'email은 중복 불가입니다.' })
  async signUp(@Body() userData: CreateUserDto) {
    return await this.userService.signUp(userData);
  }

  @Post('/sign-up/socail')
  @Public()
  @ApiOperation({
    summary: '회원가입: 소셜',
    description: 'email 중복 시, 에러메세지 안내 후 로그인페이지로 이동합니다.',
  })
  async signUpSocail(@Body() userData: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    return await this.userService.signUpSocail(userData, res);
  }

  @Patch('/password/reset')
  @Public()
  @ApiOperation({ summary: '비밀번호 재설정', description: '이메일 인증을 통해 비밀번호를 재설정합니다.' })
  async ResetPasswordByEmail(@Body() userData: ResetPasswordDto) {
    return await this.userService.resetPasswordByEmail(userData);
  }

  @Get('info')
  @ApiOperation({ summary: '회원 정보 조회', description: 'accessToken의 회원 기본/프로필 정보를 조회합니다.' })
  async getUserInfo(@Req() req) {
    return await this.userService.getUserInfo(req.user);
  }

  @Post('/profile-image/upload')
  @UseInterceptors(FilesInterceptor('files', 1))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '회원 프로필 이미지 등록',
    description: '프로필 이미지 첫 등록과 수정 모두 해당 메소드를 사용하며, 이미지 파일은 1개 제한입니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadProfileImage(@Req() req, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.userService.uploadProfileImage(req.user, files);
  }

  @Patch('/password/change')
  @ApiOperation({
    summary: '비밀번호 변경',
    description: '사용자가 직접 비밀번호를 변경합니다. 변경 완료 후 로그아웃해 주세요.',
  })
  async changePassword(@Req() req, @Body() userData: ChangePasswordDto) {
    return await this.userService.changePassword(req.user, userData);
  }

  @Patch('basic')
  @ApiOperation({ summary: '회원 기본 정보 수정', description: '수정 가능 항목: 이름(nickname), 계정(username)' })
  async updateUserBasicInfo(@Req() req, @Body() userData: UpdateUserBasicDto) {
    return await this.userService.updateUserBasicInfo(req.user, userData);
  }

  @Patch('profile')
  @ApiOperation({ summary: '회원 프로필 정보 수정', description: '수정 가능 항목: 한 줄 소개(introduce)' })
  async updateUserProfileInfo(@Req() req, @Body() userData: UpdateUserProfileDto) {
    return await this.userService.updateUserProfileInfo(req.user, userData);
  }

  @Patch('deactivate')
  @ApiOperation({ summary: '회원 계정 비활성화', description: '비밀번호를 입력해야 비활성화가 가능합니다.' })
  async deactivateUser(@Req() req, @Body() userData: DeleteUserDto) {
    return await this.userService.deactivateUser(req.user, userData);
  }

  @Delete('withdrawal')
  @ApiOperation({ summary: '회원 계정 탈퇴', description: '비밀번호를 입력해야 탈퇴가 가능합니다.' })
  async withdrawal(@Req() req, @Body() userData: DeleteUserDto) {
    return await this.userService.withdrawal(req.user, userData);
  }
}
