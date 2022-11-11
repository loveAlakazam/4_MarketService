import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  isSeller?: boolean;
  sellerNickname?: string;
  phoneNumber?: string;
  name?: string;
  password?: string;
}
