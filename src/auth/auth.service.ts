import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: User['email'], password: User['password']): Promise<UserResponseDto | null> {
    const user = await this.usersService.getOneByEmail(email);

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      return {
        id: user.id,
        name: user.name,
        accountName: user.accountName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      };
    }

    return null;
  }

  async login(user: UserResponseDto) {
    const payload = { sub: user.id, name: user.name, email: user.email, accountName: user.accountName };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
