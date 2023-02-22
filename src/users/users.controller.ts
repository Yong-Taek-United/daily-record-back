import { Body, Controller, Post } from '@nestjs/common';
import { Users } from '../entities/users.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() userData: CreateUserDto) {
        return this.usersService.create(userData);
    }

}
