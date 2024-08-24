import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * accountName에 대한 유효성 검사
   * - 이미 존재하는 accountName인지 확인합니다.
   * @param accountName 계정 이름
   */
  async validateAccountName(accountName: User['accountName']) {
    if (!accountName) {
      throw new BadRequestException('Email is required');
    }

    const existingAccountName = await this.userRepository.findOneBy({
      accountName,
    });

    if (existingAccountName) {
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

    if (existingEmail) {
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
   * 새로운 user를 생성합니다.
   * @param user CreateUserDto
   */
  async create(user: CreateUserDto) {
    if (!user.name || !user.email || !user.password || !user.accountName) {
      throw new BadRequestException('name, email, password, and accountName are required');
    }

    await this.validateEmail(user.email);
    await this.validateAccountName(user.accountName);
    this.validatePassword(user.password);

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await this.userRepository.insert({
      accountName: user.accountName,
      email: user.email,
      password: hashedPassword,
      name: user.name,
    });
  }
}
