export class ProductInfo {
  _id: object; //아이디
  user: object; //셀러명
  name: string; //상품명
  buyCountry: string; //구매국가
  buyLocation: string; //구매지역
  category: string; //카테고리
  price: number; // 가격
  description: string; //상세설명
  closeDate: Date; //날짜
  createdAt: Date; //등록일
}

export class ProductWithoutUserInfo {
  _id: object; //아이디
  name: string; //상품명
  buyCountry: string; //구매국가
  buyLocation: string; //구매지역
  category: string; //카테고리
  price: number; // 가격
  description: string; //상세설명
  closeDate: Date; //날짜
  createdAt: Date; //등록일
}
