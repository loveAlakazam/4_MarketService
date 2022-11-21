import { ProductWithoutUserInfo } from './product-info.dto';

//상품 셀러정보
export class ProductSellerInfo {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isSeller: boolean;
  sellerNickname: string;
  accountName?: string; // 예금주명
  accountBank?: string; // 은행
  accountNumber?: string; // 계좌번호
}

// 상품정보
export class ProductDetailInfoDto {
  info: ProductWithoutUserInfo;
  seller: ProductSellerInfo; // 유저정보
  others?: ProductWithoutUserInfo[];
}
