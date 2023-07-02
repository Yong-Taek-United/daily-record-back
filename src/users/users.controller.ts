import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, DeleteUserDto } from './users.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '회원가입', description: '' })
  create(@Body() userData: CreateUserDto) {
    return this.usersService.create(userData);
  }

  @Get('/:id')
  @ApiOperation({ summary: '회원 조회', description: '' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  async get(@Param('id') userId: number) {
    return await this.usersService.get(userId);
  }

  @Patch('/:id')
  @ApiOperation({ summary: '회원정보 수정', description: '' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  update(@Param('id') userId: number, @Body() userDate: UpdateUserDto) {
    return this.usersService.update(userId, userDate);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '회원 탈퇴', description: '비밀번호를 입력해야 탈퇴가 가능합니다.' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  delete(@Param('id') userId: number, @Body() userDate: DeleteUserDto) {
    return this.usersService.delete(userId, userDate);
  }
}
