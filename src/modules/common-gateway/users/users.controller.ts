import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  login(@Body() loginDto: { username: string; password: string }) {
    return this.usersService.login(loginDto.username, loginDto.password);
  }
}
