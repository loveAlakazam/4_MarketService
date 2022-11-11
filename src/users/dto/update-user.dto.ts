import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  isSeller?: boolean;
  phoneNumber?: string;
  name?: string;
  password?: string;
}
