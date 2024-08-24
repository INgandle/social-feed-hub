import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/decorator/is-public.decorator';

interface UserRequest extends Request {
  user: UserResponseDto;
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('/sign-up')
  @HttpCode(204)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.create({
      name: createUserDto.name,
      accountName: createUserDto.accountName,
      email: createUserDto.email,
      password: createUserDto.password,
    });
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('/sign-in')
  async signIn(@Request() req: UserRequest): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }
}
