import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Matches, MinLength } from 'class-validator';
import { ACCOUNT_NUMBER_REGEX } from '../../commons/regexps/regexp';
import { BANK_NAMES } from '../enums/accountBankEnum';

export class EnrollSellerDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({
    name: 'sellerNickname',
    description: '셀러 닉네임',
    example: '셀러 기석이',
  })
  sellerNickname: string; // 셀러닉네임

  @IsString()
  @MinLength(2)
  @ApiProperty({
    name: 'accountName',
    description: '예금주명',
    example: '이기석',
  })
  accountName: string; // 예금주

  @IsString()
  @IsEnum(BANK_NAMES)
  @ApiProperty({
    name: 'accountBank',
    description: '은행명',
    example: '토스뱅크',
  })
  accountBank: string; // 은행명

  @IsString()
  @Matches(ACCOUNT_NUMBER_REGEX)
  @ApiProperty({
    name: 'accountNumber',
    description: '계좌번호',
    example: '1000-1234-9876',
  })
  accountNumber: string; // 계좌번호
}
