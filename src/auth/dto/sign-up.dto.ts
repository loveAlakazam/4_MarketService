import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import {
  EMAIL_REGEXP,
  MOBILE_PHONE_REGEXP,
  PASSWORD_REGEXP,
} from '../../commons/regexps/regexp';

export class SignUpDto {
  @IsString()
  @Matches(EMAIL_REGEXP)
  @ApiProperty({
    name: 'email',
    description: '이메일',
    example: 'giseok1234@gmail.com',
  })
  email: string;

  @IsString()
  @Matches(PASSWORD_REGEXP)
  @ApiProperty({
    name: 'password',
    description:
      '비밀번호(최소 8자, 최대 15자, 무조건 대문자/소문자/숫자/특수문자 1개이상 포함 해야합니다.)',
    example: 'bank11Brothers@',
  })
  password: string;

  @IsString()
  @ApiProperty({ name: 'name', description: '이름', example: '이기석' })
  name: string;

  @IsString()
  @Matches(MOBILE_PHONE_REGEXP)
  @ApiProperty({
    name: 'phoneNumber',
    description: '휴대 전화번호',
    example: '010-1234-5678',
  })
  phoneNumber: string;
}
