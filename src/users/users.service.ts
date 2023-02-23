import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ){}

    async create(userData: CreateUserDto) {
        const { email, username, password, password2 } = userData;

        const isExist = await this.usersRepository.findOne({where:{email}});
        if(isExist) {
            throw new ConflictException('이미 존재하는 이메일입니다.');
        }

        if(password.length < 8 || password2.length < 8) {
            throw new BadRequestException('8자 이상의 비밀번호를 입력해주십시오.');
        }

        if(password !== password2) {
            throw new BadRequestException('비밀번호를 다시 확인해주십시오.');
        }

        const hashedPassword = await bcrypt.hash (password, 10);
        const user: object = {
            email: email,
            username: username,
            password: hashedPassword
        }
        this.usersRepository.save(user);
        return user
    }

    async getUser(email: string) {
        return await this.usersRepository.findOne({where:{email}});
      }

    async update(id: number, userData: UpdateUserDto) {
        const user = await this.usersRepository.update(id, userData);
        return user;
    }

    async delete(id: number) {
        const user = await this.usersRepository.delete(id);
        return user;
    }
}
