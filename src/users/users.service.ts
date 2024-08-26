import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CODE_VALIDITY_PERIOD, SALT_OR_ROUNDS } from './users.constants';
import { UserRequestDto } from './dto/user-request.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 이메일로 유저를 검색합니다.
   * @param email 이메일
   * @returns 검색된 유저 | null
   */
  async getOneByEmail(email: User['email']): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  /**
   * 이메일로 유저를 검색합니다. 없으면 에러를 발생시킵니다.
   * @param email 이메일
   * @returns 검색된 유저
   */
  async getOneByEmailOrFail(email: User['email']): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (user === null) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * accountName에 대한 유효성 검사
   * - 이미 존재하는 accountName인지 확인합니다.
   * @param accountName 계정 이름
   */
  async validateAccountName(accountName: User['accountName']) {
    if (!accountName) {
      throw new BadRequestException('AccountName is required');
    }

    const existingAccountName = await this.userRepository.findOneBy({
      accountName,
    });

    if (existingAccountName !== null) {
      throw new ConflictException('AccountName already exists');
    }
  }

  /**
   * email에 대한 유효성 검사
   * - email 형식이 올바른지 확인합니다.
   * - 존재하는 email인지 확인합니다.
   * @param email 이메일
   */
  async validateEmail(email: User['email']) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValidEmail = emailRegex.test(email);

    if (!isValidEmail) {
      throw new BadRequestException('Invalid Email');
    }

    const existingEmail = await this.userRepository.findOneBy({
      email,
    });

    if (existingEmail !== null) {
      throw new ConflictException('Email already exists');
    }
  }

  /**
   * password에 대한 유효성 검사
   * - 제약조건을 만족하는지 확인합니다.
   *  - 비밀번호는 10자 이상이어야 합니다.
   *  - 비밀번호는 숫자만으로 이루어질 수 없습니다.
   *  - 비밀번호는 [숫자, 문자, 특수문자] 중 2가지 이상을 포함해야 합니다.
   * @param password 비밀번호
   */
  validatePassword(password: string) {
    if (!password) {
      throw new BadRequestException('Password is required');
    }

    /**
     * 문자를 최소 하나 포함하고, [숫자, 특수문자] 중 최소 하나를 포함, 10자 이상
     * -> 숫자만으로 이루어지지 않음 + 숫자, 문자, 특수문자 중 2가지를 포함함 + 10자 이상
     */
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d|.*[^A-Za-z0-9]).{10,}$/;
    const isValidPassword = passwordRegex.test(password);
    if (!isValidPassword) {
      throw new BadRequestException('Invalid Password');
    }
  }

  /**
   * 승인 코드를 생성, 저장하고 이메일로 전송합니다.
   * @param email 이메일
   */
  async sendVerifyEmailCode(email: User['email']) {
    const user = await this.userRepository.findOneBy({ email });

    if (user === null) {
      throw new NotFoundException('User not found');
    }

    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 6; i++) {
      const randomIdx = Math.floor(Math.random() * characters.length);
      code += characters[randomIdx];
    }

    const now = new Date();
    await this.userRepository.update(
      { id: user.id },
      { verifyCode: code, codeExpiresAt: new Date(now.getTime() + CODE_VALIDITY_PERIOD), isEmailVerified: false },
    );

    // TODO: 이메일 전송 - 추후 추가
  }

  /**
   * 인증코드가 유효한지 확인합니다.
   * @param code 인증코드
   * @param user 유저
   */
  async verifyEmailCode(code: string, userRequestDto: UserRequestDto): Promise<void> {
    const user = await this.getOneByEmailOrFail(userRequestDto.email);

    const now = new Date();
    if (!user.codeExpiresAt || user.codeExpiresAt.getTime() < now.getTime()) {
      throw new UnauthorizedException('Code expired');
    }

    if (code !== user.verifyCode) {
      throw new UnauthorizedException('Invalid Code');
    }

    await this.userRepository.update({ id: user.id }, { isEmailVerified: true });
  }

  /**
   * 새로운 user를 생성합니다.
   * @param user CreateUserDto
   */
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, accountName } = createUserDto;

    if (!name || !email || !password || !accountName) {
      throw new BadRequestException('name, email, password, and accountName are required');
    }

    await this.validateEmail(email);
    await this.validateAccountName(accountName);
    this.validatePassword(password);

    const hashedPassword = await bcrypt.hash(password, SALT_OR_ROUNDS);

    await this.userRepository.insert({
      accountName,
      email,
      password: hashedPassword,
      name,
    });

    await this.sendVerifyEmailCode(email);
  }
}
