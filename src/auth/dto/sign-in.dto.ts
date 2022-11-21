import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    name: 'email',
    description: '이메일',
    example: 'giseok1234@gmail.com',
  })
  email: string;

  @ApiProperty({
    name: 'password',
    description:
      '비밀번호(최소 8자, 최대 15자, 무조건 대문자/소문자/숫자/특수문자 1개이상 포함 해야합니다.)',
    example: 'bank11Brothers@',
  })
  password: string;
}
