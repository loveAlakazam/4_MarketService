import { IsString, Matches } from 'class-validator';
import {
  EMAIL_REGEXP,
  MOBILE_PHONE_REGEXP,
  PASSWORD_REGEXP,
} from 'src/commons/regexps/regexp';

export class SignUpDto {
  @IsString()
  @Matches(EMAIL_REGEXP)
  email: string;

  @IsString()
  @Matches(PASSWORD_REGEXP)
  password: string;

  @IsString()
  name: string;

  @IsString()
  @Matches(MOBILE_PHONE_REGEXP)
  phoneNumber;
}
