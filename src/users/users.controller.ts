import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}
