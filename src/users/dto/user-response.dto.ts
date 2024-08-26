import { IsBoolean, IsString } from 'class-validator';

export class UserResponseDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly accountName: string;

  @IsString()
  readonly email: string;

  @IsBoolean()
  readonly isEmailVerified?: boolean;
}
