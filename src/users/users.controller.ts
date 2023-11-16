import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, DeleteUserDto, ResetPasswordDto } from '../shared/dto/users.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/skip-auth.decorator';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sign-up')
  @Public()
  @ApiOperation({ summary: '일반 회원가입', description: 'email은 중복 불가입니다.' })
  async signUp(@Body() userData: CreateUserDto) {
    return await this.usersService.signUp(userData);
  }

  @Post('/sign-up/socail')
  @Public()
  @ApiOperation({
    summary: '소셜 회원가입',
    description: 'email 중복 시, 에러메세지 안내 후 로그인페이지로 이동합니다.',
  })
  async signUpSocail(@Body() userData: CreateUserDto) {
    return await this.usersService.signUpSocail(userData);
  }

  @Get('/:id')
  @Public()
  @ApiOperation({ summary: '회원 조회', description: 'accessToken이 아닌 userId을 이용한 단순 회원조회입니다.' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  async getUser(@Param('id') userId: number) {
    return await this.usersService.getUser(userId);
  }

  @Patch('/:id')
  @ApiOperation({ summary: '회원정보 수정', description: '비밀번호 변경은 확인용 비밀번호를 함께 주셔야합니다.' })
  updateUser(@Req() req, @Body() userDate: UpdateUserDto) {
    const userId: number = req.user.sub;
    return this.usersService.updateUser(userId, userDate);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '회원 탈퇴', description: '비밀번호를 입력해야 탈퇴가 가능합니다.' })
  withdrawal(@Req() req, @Body() userDate: DeleteUserDto) {
    const userId: number = req.user.sub;
    return this.usersService.withdrawal(userId, userDate);
  }

  @Patch('/password/reset')
  @Public()
  @ApiOperation({ summary: '비밀번호 재설정', description: '이메일 인증을 통한 비밀번호 재설정입니다.' })
  ResetPasswordByEmail(@Body() userDate: ResetPasswordDto) {
    return this.usersService.resetPasswordByEmail(userDate);
  }
}
