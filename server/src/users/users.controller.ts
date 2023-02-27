import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() userData: CreateUserDto) {
        return this.usersService.create(userData);
    }

    @Get('/:id')
    get(@Param('id') userId: number) {
        return this.usersService.get(userId);
    }

    @Patch('/:id')
    update(@Param('id') userId: number, @Body() userDate: UpdateUserDto) {
        return this.usersService.update(userId, userDate);
    }

    @Delete('/:id')
    delete(@Param('id') userId: number) {
        return this.usersService.delete(userId);
    }
}
