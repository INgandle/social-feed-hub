import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { User } from 'src/entities/user.entity';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: User['email'], password: User['password']): Promise<UserResponseDto> {
    const user = await this.authService.validateUser(email, password);

    if (user === null) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
