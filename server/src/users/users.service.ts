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

    // 회원가입
    async create(userData: CreateUserDto) {
        const { email, password, password2 } = userData;

        const isExist = await this.usersRepository.findOne({where:{email}});
        if(isExist) {
            throw new ConflictException('이미 존재하는 이메일입니다.');
        }
        
        if(password !== password2) {
            throw new BadRequestException('비밀번호를 다시 확인해주십시오.');
        }

        if(password.length < 8 || password2.length < 8) {
            throw new BadRequestException('8자 이상의 비밀번호를 입력해주십시오.');
        }

        const hashedPassword = await bcrypt.hash (password, 10);
        userData.password = hashedPassword;
        this.usersRepository.save(userData);
        return {Success: true, statusCode: 201, message: '회원가입이 완료되었습니다.'};
    }

    // 회원 조회
    async get(id: number) {
        const user = await this.usersRepository.findOne({where:{id}});
        return{Success: true, statusCode: 201, message: '회원 조회가 완료되었습니다.', userData: user};
    }

    // 회원정보 수정
    async update(id: number, userData: UpdateUserDto) {
        if(userData.password) {
            if(userData.password.length < 8) {
                throw new BadRequestException('8자 이상의 비밀번호를 입력해주십시오.');
            }
            const hashedPassword = await bcrypt.hash (userData.password, 10);
            userData.password = hashedPassword;
        }
        await this.usersRepository.update(id, userData);
        return {Success: true, statusCode: 200, message: '회원 수정이 완료되었습니다.'};
    }

    // 회원 탈퇴
    async delete(id: number) {
        await this.usersRepository.delete(id);
        return {Success: true, statusCode: 200, message: '회원 삭제가 완료되었습니다.'};
    }

    // 회원 조회(로그인 인증용)
    async getUser(email: string) {
        return await this.usersRepository.findOne({where:{email}});
    }
}
