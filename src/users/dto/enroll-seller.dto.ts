import { IsString } from 'class-validator';

export class EnrollSellerDto {
  @IsString()
  sellerNickname: string;
}
