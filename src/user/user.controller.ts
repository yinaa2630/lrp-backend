import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 전체 유저 조회 (필요하면 유지, 보통은 admin용)
  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  // 내 정보 조회 (핵심 API)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return req.user;
  }
}
