import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    // Local 로그인
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req) {
        return this.authService.login(req.user);
    }

    // 로그인 인증
    @UseGuards(JwtAuthGuard)
    @Get()
    userAuth(@Req() req) {
        return req.user;
    }

    // Google 로그인 페이지
	@UseGuards(GoogleAuthGuard)
    @Get('google')
	async googleAuth() {
	  // redirect google login page
	}

    // Google 로그인
    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleAuthCallback(@Req() req, @Res() res) {
        console.log(req.user)
    }
}
