import { IsEnum, IsString, Matches, MinLength } from 'class-validator';
import { ACCOUNT_NUMBER_REGEX } from '../../commons/regexps/regexp';
import { BANK_NAMES } from '../enums/accountBankEnum';

export class EnrollSellerDto {
  @IsString()
  @MinLength(2)
  sellerNickname: string; // 셀러닉네임

  @IsString()
  @MinLength(2)
  accountName: string; // 예금주

  @IsString()
  @IsEnum(BANK_NAMES)
  accountBank: string; // 은행명

  @IsString()
  @Matches(ACCOUNT_NUMBER_REGEX)
  accountNumber: string; // 계좌번호
}
