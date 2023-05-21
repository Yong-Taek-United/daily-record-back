import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // 회원가입
    @Post()
    create(@Body() userData: CreateUserDto) {
        return this.usersService.create(userData);
    }

    // 회원 조회
    @Get('/:id')
    get(@Param('id') userId: number) {
        return this.usersService.get(userId);
    }

    // 회원정보 수정
    @Patch('/:id')
    update(@Param('id') userId: number, @Body() userDate: UpdateUserDto) {
        return this.usersService.update(userId, userDate);
    }

    // 회원 탈퇴
    @Delete('/:id')
    delete(@Param('id') userId: number) {
        return this.usersService.delete(userId);
    }
}
