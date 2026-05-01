import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입 다시 추가
  async signup(dto: CreateUserDto) {
    const { email, password } = dto;

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException('이미 존재하는 이메일입니다');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userService.createUser(email, hashedPassword);
  }

  // 로그인
  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
