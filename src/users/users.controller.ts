import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sign-up')
  @HttpCode(204)
  async createUser(@Body() user: CreateUserDto): Promise<void> {
    await this.usersService.create(user);
  }
}
