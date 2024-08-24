export class UserResponseDto {
  readonly name: string;
  readonly accountName: string;
  readonly email: string;
  readonly isEmailVerified?: boolean;
  readonly id: string;
}
