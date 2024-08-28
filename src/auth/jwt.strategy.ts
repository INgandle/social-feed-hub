import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

type JwtUser = {
  userId: User['id'];
  email: User['email'];
  accountName: User['accountName'];
};

type Payload = {
  sub: User['id'];
  name: User['name'];
  email: User['email'];
  accountName: User['accountName'];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: Payload): Promise<JwtUser> {
    return { userId: payload.sub, email: payload.email, accountName: payload.accountName };
  }
}
